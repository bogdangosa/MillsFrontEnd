import React, { useEffect, useState } from 'react';
import './Game.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import constants from '../data/constants';

const Game = () => {
    const {game_id} = useParams();
    const [TableData,setTableData] = useState([]);
    const [GameState,setGameState] = useState();
    const [SelectedPiece,setSelectedPiece] = useState(-1);
    const [PossibleDirections,setPossibleDirections] = useState([]);


    useEffect(() => {
        console.log(game_id);
        if (game_id)
            getTableData();
            getGameState();
    }, [game_id]);

    const getGameState = async () => {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_ADRESS}/get_game_state?game_id=${game_id}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            setGameState(response.data.game_state);
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
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/place_pawn?game_id=${game_id}&position=${position}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            getTableData();
            getGameState();
        }  

    }

    const movePawn = async (position,direction) => {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/move_pawn?game_id=${game_id}&position=${SelectedPiece}&direction=${direction}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            getTableData();
            getGameState();
            setSelectedPiece(-1)
        }  

    }

    const removePawn = async (position) => {    
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/remove_pawn?game_id=${game_id}&position=${position}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
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
            if (position == constants.PLAYER_SLOT){
                selectPawn(index);
                return;
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
                <p>Player pawns: 0</p>
                <p>Ai pawns: 0</p>
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

export default Game;
