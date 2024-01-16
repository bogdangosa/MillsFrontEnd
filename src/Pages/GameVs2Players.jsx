import React, { useEffect, useState } from 'react';
import './Game.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import constants from '../data/constants';

const GameVs2Players = () => {
    const {game_id} = useParams();
    const [TableData,setTableData] = useState([]);
    const [GameState,setGameState] = useState();
    const [CanPlayer1Jump,setCanPlayer1Jump] = useState(false);
    const [CanPlayer2Jump,setCanPlayer2Jump] = useState(false);
    const [SelectedPiece,setSelectedPiece] = useState(-1);
    const [PossibleDirections,setPossibleDirections] = useState([]);
    const [PlayerWhoNeedsToMove,setPlayerWhoNeedsToMove] = useState(constants.PLAYER1_SLOT);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(game_id);
        if (game_id)
            getTableData();
            getGameState();
    }, [game_id]);

    useEffect(()=>{
        console.log(TableData)
    },[TableData])

    const getGameState = async () => {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_ADRESS}/get_game_state?game_id=${game_id}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            setGameState(response.data.game_state);
            setCanPlayer1Jump(response.data.can_player_1_jump)
            setCanPlayer2Jump(response.data.can_player_2_jump)
            if (response.data.game_state == constants.GAME_ENDED)
                navigate("/")
        }
    }

    const getTableData = async () => {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_ADRESS}/get_table?game_id=${game_id}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            setTableData(response.data.table_data);
        }
    }

    const placePawn = async (position) => {
        let table_matrix = [...TableData.table_matrix]
        table_matrix[position] = PlayerWhoNeedsToMove
        setTableData({...TableData,table_matrix:table_matrix});
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/place_pawn?game_id=${game_id}&position=${position}&player_slot=${PlayerWhoNeedsToMove}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            getTableData();
            setPlayerWhoNeedsToMove(PlayerWhoNeedsToMove==constants.PLAYER1_SLOT?constants.PLAYER2_SLOT:constants.PLAYER1_SLOT)
            getGameState();
        }  

    }

    const movePawn = async (position,direction) => {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/move_pawn?game_id=${game_id}&position=${SelectedPiece}&direction=${direction}&player_slot=${PlayerWhoNeedsToMove}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            let table_matrix = [...TableData.table_matrix]
            table_matrix[position] = constants.PLAYER_SLOT;
            table_matrix[SelectedPiece] = constants.EMPTY_SLOT;
            setTableData({...TableData,table_matrix:table_matrix});
            setSelectedPiece(-1)
            setPlayerWhoNeedsToMove(PlayerWhoNeedsToMove==constants.PLAYER1_SLOT?constants.PLAYER2_SLOT:constants.PLAYER1_SLOT)
            getTableData();
            getGameState();
        }  

    }

    const jumpPawn = async (position) => {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/jump_pawn?game_id=${game_id}&position=${SelectedPiece}&new_position=${position}&player_slot=${PlayerWhoNeedsToMove}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            let table_matrix = [...TableData.table_matrix]
            table_matrix[position] = constants.PLAYER_SLOT;
            table_matrix[SelectedPiece] = constants.EMPTY_SLOT;
            setTableData({...TableData,table_matrix:table_matrix});
            setSelectedPiece(-1)
            setPlayerWhoNeedsToMove(PlayerWhoNeedsToMove==constants.PLAYER1_SLOT?constants.PLAYER2_SLOT:constants.PLAYER1_SLOT)
            getTableData();
            getGameState();
        } 
    }

    const removePawn = async (position) => {   
        const player_slot = PlayerWhoNeedsToMove==constants.PLAYER1_SLOT?constants.PLAYER2_SLOT:constants.PLAYER1_SLOT 
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/remove_pawn?game_id=${game_id}&position=${position}&player_slot=${player_slot}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            let table_matrix = [...TableData.table_matrix]
            table_matrix[position] = constants.EMPTY_SLOT;
            setTableData({...TableData,table_matrix:table_matrix});
            getTableData();
            getGameState();
        }  

    }

    const selectPawn = async (position) => {
        setSelectedPiece(position);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_ADRESS}/get_possible_directions_from_position?game_id=${game_id}&position=${position}`); 
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            setPossibleDirections(response.data.possible_directions)
        }
    }


    const handlePawnClick = async (position,index) => {
        if (GameState == constants.FILL_THE_TABLE) 
            placePawn(index);
        else if (GameState == constants.MOVE_PIECES){
            if (position == PlayerWhoNeedsToMove){
                selectPawn(index);
                return;
            }
            if ((CanPlayer1Jump && PlayerWhoNeedsToMove==constants.PLAYER1_SLOT) || ( CanPlayer2Jump && PlayerWhoNeedsToMove==constants.PLAYER2_SLOT)){
                jumpPawn(index)
                return
            }
            const direction_object = PossibleDirections.find((direction)=>direction.position==index);
            if (direction_object)
                movePawn(index,direction_object.direction);
        }
        else if (GameState == constants.REMOVE_PIECES)
            removePawn(index);
    }



    return (
        <div className="game">
            <div className="nr-of-pawns-placed">
                <p>Player 1 pawns: {TableData?.player1_pawns}</p>
                <p>Player 2 pawns: {TableData?.player2_pawns}</p>
                <p>{GameState==constants.FILL_THE_TABLE?"Fill the board!":(GameState==constants.MOVE_PIECES?"Move Pieces":"Remove Pieces")}</p>
            </div>
            <div className="table-grid">
                <div className="big-square square"></div>
                <div className="medium-square square"></div>
                <div className="small-square square"></div>
                <div className="horizontal-line line"></div>
                <div className="vertical-line line"></div>
                {TableData?.table_matrix?.map((position,index)=>{
                    return <div className={`position position-${index} ${SelectedPiece==index?"selected":""}  ${position==constants.PLAYER_SLOT?"player-pawn":""} ${position==constants.AI_SLOT?"ai-pawn":""}`} 
                        key={index} onClick={()=>handlePawnClick(position,index)}></div>
                })}
            </div>

        </div>
    );
};

export default GameVs2Players;
