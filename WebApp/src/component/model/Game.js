import React from 'react';
import Player from './Player';
import {Modal} from 'antd';
import Coin from '../Coin';


export default class Game {

    constructor(){
        this.player =null;
        this.AI = null;
        this.firstHandPlayer =null;
        this.currentPlayer = null;
        this.currentInOperating= null;
    }

    setupGame=()=>{

        this.chooseDecks()
            .then(this.setupPlayer)
            .then(this.chooseFirstHandPlayer)
            .then(this.startFirstTurn);

    };



    judge=()=>{

    };

    switchHand=()=>{

    };


    chooseDecks = () =>{
        return new Promise( (resolve, reject)=> {

            const playerCars =[];
            const AI_Cards =[];

            if (playerCars.length>0 ) resolve([playerCars,AI_Cards,false,false]);

            else {
                if (reject) reject();
            };
        });
    }


    chooseFirstHandPlayer = ()=>{

        const result ={head:0,tail:0};

        return new Promise( (resolve, reject)=> {
            Modal.info({
                title: 'Flip a coin',
                content: <Coin result={result}/>,
                onOk: resolve(result),
                maskClosable:false,
                keyboard:false,
            });

        });
    }


    startFirstTurn =(result)=>{

        this.firstHandPlayer = result? this.player : this.AI;

        this.currentPlayer = this.firstHandPlayer;
        this.currentInOperating = this.firstHandPlayer;

    }

    setupPlayer=(deckCards)=>{

        return new Promise( (resolve, reject)=> {

            this.player= Player.getPlayer(currentUser,deckCards[0],deckCards[2]);

            this.AI= Player.getAIPlayer(AI_User,deckCards[1],deckCards[3]);

            this.player.setOpponent(this.AI);
            this.AI.setOpponent(this.player);

            resolve();

        });
    }

}
