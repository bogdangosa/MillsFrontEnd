import React from 'react';
import { useState } from 'react';
import './Home.css';
import SimpleButton from '../Components/Buttons/SimpleButtons';
import constants from '../data/constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const startGame = async (game_difficulty,game_mode) => {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/create_game?game_difficulty=${game_difficulty}&game_mode=${game_mode}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            if(game_mode==constants.PLAYER_VS_PLAYER)
                navigate(`/2player_game/${response.data.game_id}`);
            else
                navigate(`/ai_game/${response.data.game_id}`);
        }
    }


    return (
        <div className='home-page'>
            <h1>Welcome to Mills | Nine men morris!</h1>
            <p>Please select your game dificulty</p>
            <div className="game-mode-container">
                <SimpleButton onClick={()=>startGame(constants.EASY_MODE,constants.PLAYER_VS_PLAYER)}>PvP</SimpleButton>
                <SimpleButton onClick={()=>startGame(constants.EASY_MODE,constants.PLAYER_VS_AI)}>Easy</SimpleButton>
                <SimpleButton onClick={()=>startGame(constants.MEDIUM_MODE,constants.PLAYER_VS_AI)}>Medium</SimpleButton>
                <SimpleButton onClick={()=>startGame(constants.HARD_MODE,constants.PLAYER_VS_AI)}>Hard</SimpleButton>

            </div>
        </div>
    );
};

export default Home;
