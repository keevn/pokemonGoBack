import React from 'react';
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';
import './Bench.css';
import {Card, findBasicCard, randomCard} from '../../component/model/Card';
import {
    CARD_ENERGY,
    CARD_POKEMON,
    CARD_TRAINER,
    POKEMON_STAGE_ONE,
    TRAINER_ITEM,
    POKEMON_POISONED
} from "../../component/constants";
import PokemonView from "../../component/PokemonView";
import Pokemon from "../../component/model/Pokemon";

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
const CardWidth=260;
const CardHeight=CardWidth/200*258;
const CardContainerHeight=CardHeight;
const CardContainerWidth=CardWidth;           //left margin

export default class Bench extends React.Component {
    constructor(props) {
        super(props);

        const {id}=props;

        this.id =id;


        const BenchSize = props.BenchSize? props.BenchSize:5;
        this.containerWidth = CardContainerWidth*BenchSize;
        this.containerHeight = CardHeight+10;
        this.activeId=1;

        this.Bench = React.createRef();


        this.pokemons = props.pokemons;

        const itemsCount = this.pokemons.length;

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
        const node = this.Bench.current;

        node.addEventListener('touchmove', this.handleTouchMove);
        node.addEventListener('mousemove', this.handleMouseMove);
    };

    componentWillUnmount() {

        const node = this.Bench.current;

        node.removeEventListener('touchmove', this.handleTouchMove);
        node.removeEventListener('mousemove', this.handleMouseMove);
    };

    handleTouchStart = (key, pressLocation, e) => {
        this.handleMouseDown(key, pressLocation, e.touches[0]);
    };

    handleTouchMove = (e) => {
        e.preventDefault();
        this.handleMouseMove(e.touches[0]);
    };

    handleMouseDown = (pos, pressX, {pageX, pageY,button}) => {   //pos:the index of card in position
        //console.log(pos, pressX, {pageX, pageY});          //pressX:
        this.setState({
            topDeltaX: pageX - pressX,
            mouseX: pressX,
            topDeltaY: pageY,
            mouseY: 0,
            isPressed: !button,           //only react to left button (single click)
            originalPosOfLastPressed: pos,
        });
        /*this.state.topDeltaX= pageX - pressX;
        this.state.mouseX=pressX;
        this.state.topDeltaY=pageY;
        this.state.mouseY= 0;
        this.state.isPressed= !button;
        this.state.originalPosOfLastPressed= pos;*/

    };

    handleMouseMove = ({pageX, pageY}) => {
       // console.log(this.id,{pageX, pageY});
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

    handleMouseUp = () => {
        
        this.setState({isPressed: false, topDeltaX: 0});

        //this.state.isPressed=false;
        //this.state.topDeltaX=0;

    };

    handleOnClick =(i)=>{

        if (this.pokemons[i].type!==CARD_POKEMON) return;
         this.pokemons[i].attachEnergy(randomCard(CARD_ENERGY));
         this.pokemons[i].hurt(20);
    };

    onContextMenu =(i,event)=>{
        event.preventDefault();

        if (this.pokemons[i].type!==CARD_POKEMON) return;
        const energycards = this.pokemons[i].detachEnergy();


        this.pokemons[i].heal(10);
    };

    render() {
        //console.log(this.id,"111");
        const {mouseX, mouseY, isPressed, originalPosOfLastPressed, order,itemsCount} = this.state;
        const pageOffset = this.pageOffset;
        const containerWidth = this.containerWidth;
        const containerHeight = this.containerHeight;
        const pokemons = this.pokemons;
        const activeId = this.activeId;
        const pokemonList =  range(itemsCount).map(i => {

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
                <Motion style={style} key={pokemons[i].key}>
                    {({scale, shadow, x, y}) =>
                        <div
                            onMouseDown={this.handleMouseDown.bind(null,i, x)}
                            onMouseUp={this.handleMouseUp}
                            onTouchStart={this.handleTouchStart.bind(null, i, x, y)}
                            onTouchEnd={this.handleMouseUp.bind(null, i, x, y)}
                            //onClick={this.handleOnClick.bind(null,i)}
                            onContextMenu={this.onContextMenu.bind(null,i)}
                            className="card-container"
                            style={{
                                boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                                transform: `translate3d(${x}px,${y}px, 0) scale(${scale})`,
                                WebkitTransform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
                                zIndex: originalPosOfLastPressed === i && isPressed ? 99 : order.indexOf(i),
                            }}>
                            <PokemonView pokemon={pokemons[i]} attack={order.indexOf(i)===itemsCount-1}/>

                        </div>
                    }
                </Motion>
            );
        });

        return (
            <div className="bench-outer" style={{width: containerWidth,height:containerHeight}} ref={this.Bench}>
                <div className="bench">
                    {pokemonList}
                </div>
            </div>
        );
    };
}