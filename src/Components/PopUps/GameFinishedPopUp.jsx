import React from 'react';
import PopUpContainer from './PopUpContainer';
import SimpleButton from '../Buttons/SimpleButtons';
import './GameFinishedPopUp.css'

const GameFinishedPopUp = ({close,has_player_won,open_menu,start_new_game}) => {

  return (
    <PopUpContainer className="game-finished-popup" close={()=>close()}>
        
        <h1>{has_player_won?"You won!":"You Lost"}</h1>
        <div className="buttons-container">
            <SimpleButton onClick={()=>open_menu()}>main menu</SimpleButton>
            <SimpleButton onClick={()=>start_new_game()}>play again</SimpleButton>
        </div>
        
    </PopUpContainer>
  );
};

export default GameFinishedPopUp;
