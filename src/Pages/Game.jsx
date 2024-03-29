import React, { useEffect, useState } from 'react';
import './Game.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import constants from '../data/constants';
import NotificationPopUp from '../Components/PopUps/NotificationPopUp';
import { AnimatePresence } from 'framer-motion';
import GameFinishedPopUp from '../Components/PopUps/GameFinishedPopUp';

const Game = () => {
    const {game_id} = useParams();
    const [TableData,setTableData] = useState([]);
    const [GameState,setGameState] = useState();
    const [CanPlayerJump,setCanPlayerJump] = useState(false);
    const [SelectedPiece,setSelectedPiece] = useState(-1);
    const [PossibleDirections,setPossibleDirections] = useState([]);
    const [NotificationPopUpState, setNotificationPopUpState] = useState(null);
    const [GameFinishedPopupState, setGameFinishedPopupState] = useState(null);
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
            setCanPlayerJump(response.data.can_player_1_jump)
            if (response.data.game_state == constants.GAME_ENDED)
                setGameFinishedPopupState(true)
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
        table_matrix[position] = constants.PLAYER_SLOT;
        setTableData({...TableData,table_matrix:table_matrix});
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/place_pawn?game_id=${game_id}&position=${position}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            getTableData();
            getGameState();
        }  
        else{
            getTableData();
            getGameState();
            setNotificationPopUpState(response.data);
            setTimeout(() => setNotificationPopUpState(null), 3000);
        }

    }

    const movePawn = async (position,direction) => {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/move_pawn?game_id=${game_id}&position=${SelectedPiece}&direction=${direction}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            let table_matrix = [...TableData.table_matrix]
            table_matrix[position] = constants.PLAYER_SLOT;
            table_matrix[SelectedPiece] = constants.EMPTY_SLOT;
            setTableData({...TableData,table_matrix:table_matrix});
            setSelectedPiece(-1)
            setPossibleDirections([])
            setTimeout(()=>{
                getTableData();
                getGameState();
            },500)
        }  
        else{
            setNotificationPopUpState(response.data);
            setTimeout(() => setNotificationPopUpState(null), 3000);
        }

    }

    const jumpPawn = async (position) => {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/jump_pawn?game_id=${game_id}&position=${SelectedPiece}&new_position=${position}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            let table_matrix = [...TableData.table_matrix]
            table_matrix[position] = constants.PLAYER_SLOT;
            table_matrix[SelectedPiece] = constants.EMPTY_SLOT;
            setTableData({...TableData,table_matrix:table_matrix});
            setSelectedPiece(-1)
            setTimeout(()=>{
                getTableData();
                getGameState();
            },500)
        }  
        else{
            setNotificationPopUpState(response.data);
            setTimeout(() => setNotificationPopUpState(null), 3000);
        }
    }

    const removePawn = async (position) => {    
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/remove_pawn?game_id=${game_id}&position=${position}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            let table_matrix = [...TableData.table_matrix]
            table_matrix[position] = constants.EMPTY_SLOT;
            setTableData({...TableData,table_matrix:table_matrix});
            setTimeout(()=>{
                getTableData();
                getGameState();
            },500)
        }  
        else{
            setNotificationPopUpState(response.data);
            setTimeout(() => setNotificationPopUpState(null), 3000);
        }

    }

    const selectPawn = async (position) => {
        setSelectedPiece(position);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_ADRESS}/get_possible_directions_from_position?game_id=${game_id}&position=${position}`); 
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            setPossibleDirections(response.data.possible_directions)
        }
        else{
            setNotificationPopUpState(response.data);
            setTimeout(() => setNotificationPopUpState(null), 3000);
        }
    }


    const handlePawnClick = async (position,index) => {
        if (GameState == constants.FILL_THE_TABLE) 
            placePawn(index);
        else if (GameState == constants.MOVE_PIECES){
            if (position == constants.PLAYER_SLOT){
                selectPawn(index);
                return;
            }
            if (CanPlayerJump){
                jumpPawn(index)
                return
            }
            const direction_object = PossibleDirections.find((direction)=>direction.position==index);
            if (direction_object)
                movePawn(index,direction_object.direction);
            else{
                setNotificationPopUpState("you can't move there!");
                setTimeout(() => setNotificationPopUpState(null), 3000);
            }
        }
        else if (GameState == constants.REMOVE_PIECES)
            removePawn(index);
    }



    return (
        <div className="game">
            <div className="nr-of-pawns-placed">
                <p>Player pawns: {TableData?.player1_pawns}</p>
                <p>Ai pawns: {TableData?.player2_pawns}</p>
                <p>{GameState==constants.FILL_THE_TABLE?"Fill the board!":(GameState==constants.MOVE_PIECES?"Move Pieces":"Remove Pieces")}</p>
            </div>
            <div className="table-grid">
                <div className="big-square square"></div>
                <div className="medium-square square"></div>
                <div className="small-square square"></div>
                <div className="horizontal-line line"></div>
                <div className="vertical-line line"></div>
                {TableData?.table_matrix?.map((position,index)=>{
                    const direction_object = PossibleDirections.find((direction)=>direction.position==index);
                    return <div className={`position position-${index} ${(direction_object && !CanPlayerJump)?"possible-position":""} ${SelectedPiece==index?"selected":""}  ${position==constants.PLAYER_SLOT?"player-pawn":""} ${position==constants.AI_SLOT?"ai-pawn":""}`} 
                        key={index} onClick={()=>handlePawnClick(position,index)}></div>
                })}
            </div>

            <AnimatePresence mode="wait">
                {NotificationPopUpState && <NotificationPopUp close={() => setNotificationPopUpState(null)}>{NotificationPopUpState}</NotificationPopUp>}
                {GameFinishedPopupState!=null && <GameFinishedPopUp has_player_won={GameFinishedPopupState} open_menu={()=>navigate('/')}/>}
            </AnimatePresence>
        </div>
    );
};

export default Game;
