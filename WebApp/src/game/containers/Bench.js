import React from 'react';
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';
import CardView from '../views/CardView';
import './Bench.css';
import {Card, findBasicCard, randomCard} from '../../component/model/Card';
import {
    CARD_ENERGY,
    CARD_POKEMON,
    CARD_TRAINER,
    POKEMON_BASIC,
    POKEMON_STAGE_ONE,
    TRAINER_ITEM
} from "../../component/constants";
import PokemonView from "../views/PokemonView";
import Pokemon from "../../component/Pokemon";

function reinsert(arr, from, to) {
    const _arr = arr.slice(0);
    const val = _arr[from];
    _arr.splice(from, 1);
    _arr.splice(to, 0, val);
    return _arr;
}

function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 300, damping: 50};
const CardWidth=120;
const CardHeight=CardWidth/200*258;
const CardContainerHeight=CardHeight;
const CardContainerWidth=CardWidth;           //left margin

export default class Bench extends React.Component {
    constructor(props) {
        super(props);

        const itemsCount = props.itemSize? parseInt(props.itemSize,10):5;
        const BenchSize = props.BenchSize? props.BenchSize:5;
        this.containerWidth = CardContainerWidth*BenchSize;
        this.containerHeight = CardHeight+10;
        this.activeId=1;

        this.pokemons = range(itemsCount).map((i)=>{

            const stageone = randomCard(CARD_POKEMON, POKEMON_STAGE_ONE);


            const attachable_item_pokemonCard= randomCard(CARD_TRAINER,TRAINER_ITEM,true);

            const pokemoncard = findBasicCard(stageone);

            const pokemon = new Pokemon(pokemoncard);

            if (i) pokemon.attachItem(attachable_item_pokemonCard);

            //pokemon.evolve(stageone);

            return pokemon;

        });

        this.state = {
            itemsCount:itemsCount,
            topDeltaX: 0,
            mouseX: 0,
            topDeltaY: 0,
            mouseY: 0,
            isPressed: false,
            originalPosOfLastPressed: null,
            order: range(itemsCount),
        };


        this.calculateOffset();
    };

    

    calculateOffset = () => {
        this.pageOffset = CardContainerWidth * this.state.itemsCount > this.containerWidth ? (this.containerWidth - CardContainerWidth) / (this.state.itemsCount - 1) : CardContainerWidth;
    };

    componentDidMount() {
        window.addEventListener('touchmove', this.handleTouchMove);
        //window.addEventListener('touchend', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        //window.addEventListener('mouseup', this.handleMouseUp);
    };

    handleTouchStart = (key, pressLocation, e) => {
        this.handleMouseDown(key, pressLocation, e.touches[0]);
    };

    handleTouchMove = (e) => {
        e.preventDefault();
        this.handleMouseMove(e.touches[0]);
    };

    handleMouseDown = (pos, pressX, {pageX, pageY}) => {
        console.log(pos, pressX, {pageX, pageY});
        this.setState({
            topDeltaX: pageX - pressX,
            mouseX: pressX,
            topDeltaY: pageY,
            mouseY: 0,
            isPressed: true,
            originalPosOfLastPressed: pos,
        });
    };

    handleMouseMove = ({pageX, pageY}) => {
        const {isPressed, topDeltaX, topDeltaY, order, originalPosOfLastPressed, itemsCount} = this.state;

        if (isPressed) {
            const mouseX = pageX - topDeltaX;
            const mouseY = pageY - topDeltaY;
            const currentslot = clamp(Math.round(mouseX / this.pageOffset), 0, itemsCount - 1);
            let newOrder = order;

            if (currentslot !== order.indexOf(originalPosOfLastPressed)) {
                newOrder = reinsert(order, order.indexOf(originalPosOfLastPressed), currentslot);
            }

            this.setState({mouseX: mouseX, mouseY: mouseY, order: newOrder});
        }
    };

    handleMouseUp = (pos, pressX, pressY, {pageX, pageY}) => {
        console.log(pos, pressX, pressY, {pageX, pageY});
        const { mouseY, order, originalPosOfLastPressed} = this.state;

        let {itemsCount} = this.state;

        let newOrder = order;
        
        if (mouseY<-20 || mouseY >this.containerHeight+20)     {
            const pos = order.indexOf(originalPosOfLastPressed);
            newOrder  = [...order.slice(0,pos),
                ...order.slice(pos+1)];
            itemsCount--;
        }

        this.setState({isPressed: false, topDeltaX: 0, order: newOrder,itemsCount:itemsCount});

        this.calculateOffset();
    };

    handleOnClick =(i)=>{

        if (this.pokemons[i].type!==CARD_POKEMON) return;
         this.pokemons[i].attachEnergy(randomCard(CARD_ENERGY));
         this.pokemons[i].hurt(20);
    };

    onContextMenu =(event,i)=>{
        event.preventDefault();

        if (this.pokemons[i].type!==CARD_POKEMON) return;
        const energycards = this.pokemons[i].detachEnergy();

        if (false && energycards) {
            let {itemsCount,order} = this.state;

            itemsCount +=  energycards.length;



            order = range(energycards.length).map(k => {

                this.pokemons = [...this.pokemons,Card.getCardInstants(energycards[k].id)];
                return [...order,this.pokemons.length-1];
            });

            console.log(order);

            this.setState({itemsCount:itemsCount,order:order});

            this.calculateOffset();
        }

        this.pokemons[i].heal(10);
    };

    render() {
        const {mouseX, mouseY, isPressed, originalPosOfLastPressed, order,itemsCount} = this.state;
        const pageOffset = this.pageOffset;
        const containerWidth = this.containerWidth;
        const containerHeight = this.containerHeight;
        const pokemons = this.pokemons;
        const activeId = this.activeId;

        return (
            <div className="bench-outer" style={{width: containerWidth,height:containerHeight}}>
                <div className="bench">
                    {range(itemsCount).map(i => {

                        const style = originalPosOfLastPressed === i && isPressed
                            ? {
                                scale: spring(1.1, springConfig),
                                shadow: spring(16, springConfig),
                                x: mouseX,
                                y: mouseY,
                            }
                            : {
                                scale: spring(1, springConfig),
                                shadow: spring(1, springConfig),
                                x: spring(order.indexOf(i) * pageOffset, springConfig),
                                y: spring(0, springConfig),
                            };
                        return (
                            <Motion style={style} key={i}>
                                {({scale, shadow, x, y}) =>
                                    <div
                                        onMouseDown={this.handleMouseDown.bind(null, i, x)}
                                        onMouseUp={this.handleMouseUp.bind(null, i, x, y)}
                                        onTouchStart={this.handleTouchStart.bind(null, i, x, y)}
                                        onTouchEnd={this.handleMouseUp.bind(null, i, x, y)}
                                        onClick={this.handleOnClick.bind(null,i)}
                                        onContextMenu={(e) =>this.onContextMenu(e,i)}
                                        className="card-container"
                                        style={{
                                            boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                                            transform: `translate3d(${x}px,${y}px, 0) scale(${scale})`,
                                            WebkitTransform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
                                            zIndex: originalPosOfLastPressed === i && isPressed ? 99 : order.indexOf(i),
                                        }}>
                                        <PokemonView pokemon={pokemons[i]} active={order.indexOf(i)===itemsCount-1}/>

                                    </div>
                                }
                            </Motion>
                        );
                    })}
                </div>
            </div>
        );
    };
}