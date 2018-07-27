import React from 'react';
import './Welcome.css';
import Bench from './containers/Bench';
import Coin from '../component/Coin';
import random from "lodash.random";
import {findBasicCard, randomCard} from "../component/model/Card";
import {
    CARD_ENERGY,
    CARD_POKEMON,
    CARD_TRAINER,
    POKEMON_POISONED,
    POKEMON_STAGE_ONE,
    TRAINER_ITEM
} from "../component/constants";
import Pokemon from "../component/model/Pokemon";
import range from "lodash.range";


class Board extends React.Component{

    constructor(props) {
        super(props);

        this.Board = React.createRef();

        this.state = {
            flipCoin : true,
        };

        this.pokemons = range(3).map((i)=>{

            const stageone = randomCard(CARD_POKEMON, POKEMON_STAGE_ONE);


            const attachable_item_pokemonCard= randomCard(CARD_TRAINER,TRAINER_ITEM,true);

            const pokemoncard = findBasicCard(stageone);

            const pokemon = new Pokemon(pokemoncard);


            pokemon.evolve(stageone);

            if (!i) {
                pokemon.attachItem(attachable_item_pokemonCard);
                pokemon.attachEnergy(randomCard(CARD_ENERGY));
                pokemon.attachEnergy(randomCard(CARD_ENERGY));
                pokemon.attachEnergy(randomCard(CARD_ENERGY));
                pokemon.attachEnergy(randomCard(CARD_ENERGY));
                pokemon.setStatus(POKEMON_POISONED);
            }

            return pokemon;

        });

        
    }

    coin_callback=(value)=>{

        console.log(value);

    }

    flipCoin=()=> {
        this.setState({flipCoin:true});
    }

    muteEvent =(event)=>{
        event.preventDefault();
        event.stopPropagation();
    };

    muteAllOperation =()=>{
        const node = this.Board.current;

        node.addEventListener('click', this.muteEvent, true);
        node.addEventListener('mousedown', this.muteEvent, true);
        node.addEventListener('mouseup', this.muteEvent, true);

        node.addEventListener('touchmove', this.muteEvent, true);
        node.addEventListener('mousemove', this.muteEvent, true);
        
    };

    resetAllOperation =()=>{

        console.log("remove");
        const node = this.Board.current;

        node.removeEventListener('click', this.muteEvent,true);
        node.removeEventListener('mousedown', this.muteEvent,true);
        node.removeEventListener('mouseup', this.muteEvent,true);

        node.removeEventListener('touchmove', this.muteEvent, true);
        node.removeEventListener('mousemove', this.muteEvent, true);


    };


    componentDidMount() {
        
        //this.muteAllOperation();


       // this.timerId = setTimeout(this.resetAllOperation,5000);
        //this.autoFlip = setInterval(()=>{ this.setState({usersTurn : true});}, 10000);
    }

    componentWillUnmount() {

        //this.resetAllOperation();

        //clearInterval(this.autoFlip);
        //clearTimeout(this.timerId);
    }


    render() {
        return  (
            <div className="welcome-content" ref={this.Board}>

                    <Bench BenchSize='3' pokemons={this.pokemons} id={1}/>
                    <p/>
                    <button onClick={this.flipCoin} >Click to flip a coin.</button>
                    {this.state.flipCoin? <Coin afterFlip={this.coin_callback} size='100'/>:null}
              

            </div>
        );
    }
}

export default Board ;