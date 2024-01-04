import React from 'react';
import { useState } from 'react';
import './Home.css';
import SimpleButton from '../Components/Buttons/SimpleButtons';
import constants from '../data/constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const startGame = async (game_difficulty) => {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ADRESS}/create_game?game_difficulty=${game_difficulty}`);
        console.log(response.data);
        if (response.data.status == constants.SUCCESS_CODE) {
            navigate(`/game/${response.data.game_id}`);
        }
    }


    return (
        <div className='home-page'>
            <h1>Welcome to Mills | Nine men morris!</h1>
            <p>Please select your game dificulty</p>
            <div className="game-mode-container">
                <SimpleButton onClick={()=>startGame(constants.EASY_MODE)}>Easy</SimpleButton>
                <SimpleButton onClick={()=>startGame(constants.MEDIUM_MODE)}>Medium</SimpleButton>
                <SimpleButton onClick={()=>startGame(constants.HARD_MODE)}>Hard</SimpleButton>

            </div>
        </div>
    );
};

export default Home;
