import React from 'react';
import {Spring, animated,AnimatedValue} from 'react-spring';
import {Gesture} from 'react-with-gesture';
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

const CardWidth = 150;
const CardHeight = CardWidth / 250 * 345;
const CardContainerHeight = CardHeight;
const CardContainerWidth = CardWidth;           //left margin

export default class Bench extends React.Component {


    constructor(props) {
        super(props);

        const {id} = props;

        this.id = id;


        const BenchSize = props.BenchSize ? props.BenchSize : 5;
        this.containerWidth = CardContainerWidth * BenchSize;
        this.containerHeight = CardHeight + 10;
        this.activeId = 1;

        this.Bench = React.createRef();


        this.pokemons = props.pokemons;


        const itemsCount = this.pokemons.length;

        this.state = {
            itemsCount: itemsCount,
            topDeltaX: 0,
            mouseX: 0,
            topDeltaY: 0,
            mouseY: 0,
            isPressed: false,
            isOver: false,
            originalPosOfLastPressed: null,
            originalPosOfLastOver: null,
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
        e.preventDefault() || this.handleMouseMove(e.touches[0]);
    };

    handleMouseDown = (pos, pressX, {pageX, pageY, button}) => {   //pos:the index of cardEl in position
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

    handleMouseOver = (index) => {
        const {isPressed} = this.state;
          //if (isPressed && )

    };

    handleMouseOut = () => {

        this.setState({isOver: false,});

    };

    handleMouseMove = ({pageX, pageY}) => {
        console.log({pageX, pageY});
        const {isPressed, topDeltaX, topDeltaY, order, originalPosOfLastPressed, itemsCount, isOver} = this.state;

        //console.log(isOver);
        if (isPressed&&this.pokemons[originalPosOfLastPressed].draggable) {
            const mouseX = pageX - topDeltaX;
            const mouseY = pageY - topDeltaY;
            const currentSlot = clamp(Math.round(mouseX / this.pageOffset), 0, itemsCount - 1);
            let newOrder = order;

            if (currentSlot !== order.indexOf(originalPosOfLastPressed)) {
                newOrder = reinsert(order, order.indexOf(originalPosOfLastPressed), currentSlot);
            }

            this.setState({mouseX: mouseX, mouseY: mouseY, order: newOrder});
        }
    };

    /*this.pokemons = range(5).map((i)=>{

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
                pokemon.draggable=true;
            } else{
                const card= randomCard(CARD_ENERGY);
                if (i % 2 === 0)   card.draggable=true ;
                return card;
            }

            return pokemon;

        });*/


    handleMouseUp = () => {

        this.setState({isPressed: false, topDeltaX: 0});

        //this.state.isPressed=false;
        //this.state.topDeltaX=0;

    };

    handleOnClick = (i) => {

        if (this.pokemons[i].type !== CARD_POKEMON) return;
        this.pokemons[i].attachEnergy(randomCard(CARD_ENERGY));
        this.pokemons[i].hurt(20);
    };

    onContextMenu = (i, event) => {
        event.preventDefault();

        if (this.pokemons[i].type !== CARD_POKEMON) return;
        const energycards = this.pokemons[i].detachEnergy();


        this.pokemons[i].heal(10);
    };

    aftermoveCallback =(key)=>{        //the key of cardEl that just finished animation,

        const curretnCard = this.pokemons[this.state.originalPosOfLastPressed];

        if (curretnCard && curretnCard.instantKey===key) {
            console.log('Card do something ',curretnCard.type,curretnCard.name);
        }

    } ;

    render() {
        //console.log(this.id,"111");
        const {mouseX, mouseY, isPressed, originalPosOfLastPressed, order, itemsCount, isOver} = this.state;

        const pokemonList = range(itemsCount).map(i => {

            const active = originalPosOfLastPressed === i && isPressed;
            const x= active ? mouseX : order.indexOf(i) * this.pageOffset;
            const y= active ? mouseY : 0;

            return <div
                        onMouseDown={this.handleMouseDown.bind(null, i, x)}
                        onMouseOver={this.handleMouseOver.bind(null, i)}
                        onMouseOut={this.handleMouseOut.bind(null, i)}
                        onMouseUp={this.handleMouseUp}
                        //onClick={this.handleOnClick.bind(null,i)}
                        onContextMenu={this.onContextMenu.bind(null, i)}
                        className="card-container"
                        style={{
                            zIndex: active ? 99 : order.indexOf(i),
                        }} key={this.pokemons[i].instantKey} >
                        <PokemonView pokemon={this.pokemons[i]} attack={order.indexOf(i) === itemsCount - 1}
                                     width={this.props.cardSize} x={x} y={y} immediate={active} glow={this.pokemons[i].draggable}
                                     afterMove={!active? this.aftermoveCallback:null} />
                    </div>;
        });

        return (
            <div className="bench-outer" style={{width: this.containerWidth, height: this.containerHeight}}
                 ref={this.Bench}>
                <div className="bench">
                    {pokemonList}
                </div>
            </div>
        );
    };
}