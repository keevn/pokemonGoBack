import React from 'react';
import './Welcome.css';
import {Card, EnergyCard, PokemonCard, randomCard, TrainerCard} from "../component/model/Card";
import Deck from '../component/Deck';
import Hand from '../component/Hand';
import CardStack from "../component/model/CardStack";
import CardView from "../component/CardView";
import PokemonView from "../component/PokemonView";
import Bench from "../component/Bench";
import Pokemon from "../component/model/Pokemon";
import {CARD_ENERGY, POKEMON_BASIC} from "../component/constants";



class Board extends React.Component {

    constructor(props) {
        super(props);


        const userDeckCards = props.currentUser.deck.cardList.slice(0, 20);

        //console.log(userDeckCards);

        this.Board = React.createRef();

        this.state = {
            flipCoin: true,
            changed: false,
            currentPlayer: null,
            currentInOperating: null,
        };


        //initial all the deck cards
        const user_cards = userDeckCards.map(cardId => Card.getCardInstants(cardId));


        //create card stacks,include hand, bench, deck, prize card, discard pile, active spot, and pit stop;
        const user_hand = CardStack.getHand({x: 0, y: 500});
        const user_bench = CardStack.getBench({x: 150, y: 300});
        const user_deck = CardStack.getDeck({x: 0, y: 0, Cards: user_cards});


        user_cards.forEach(card => {
            card.stack = user_deck;
            card.zIndex = user_deck.Offsets.get(card.instantKey).zIndex;
        });


        this.player1 = {

            deck: user_deck,
            hand: user_hand,
            bench: user_bench,
            cards: user_cards,

        };


        //setting up for draggable feature
        this.state = Object.assign({}, this.state, {
            topDeltaX: 0,
            mouseX: 0,
            topDeltaY: 0,
            mouseY: 0,
            isPressed: false,
            isOver: false,
            selectedIndex: null,
            dragTarget: null,
        });


    }

    coin_callback = (value) => {

        console.log(value);

    }

    flipCoin = () => {
        this.setState({flipCoin: true});
    }


    muteEvent = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    muteAllOperation = () => {
        const node = this.Board.current;

        node.addEventListener('click', this.muteEvent, true);
        node.addEventListener('mousedown', this.muteEvent, true);
        node.addEventListener('mouseup', this.muteEvent, true);

        node.addEventListener('touchmove', this.muteEvent, true);
        node.addEventListener('mousemove', this.muteEvent, true);

    };

    resetAllOperation = () => {

        console.log("remove");
        const node = this.Board.current;

        node.removeEventListener('click', this.muteEvent, true);
        node.removeEventListener('mousedown', this.muteEvent, true);
        node.removeEventListener('mouseup', this.muteEvent, true);

        node.removeEventListener('touchmove', this.muteEvent, true);
        node.removeEventListener('mousemove', this.muteEvent, true);


    };


    componentDidMount() {

        const node = this.Board.current;

        node.addEventListener('mousemove', this.handleMouseMove);
        node.addEventListener('mouseup', this.handleMouseUp);

        //this.muteAllOperation();


        //this.timerId = setTimeout(this.resetAllOperation,5000);
        //this.autoFlip = setInterval(()=>{ this.setState({usersTurn : true});}, 10000);
    }

    componentWillUnmount() {


        const node = this.Board.current;

        node.removeEventListener('mousemove', this.handleMouseMove);
        node.removeEventListener('mouseup', this.handleMouseUp);

        //this.resetAllOperation();

        //clearInterval(this.autoFlip);
        //clearTimeout(this.timerId);
    }

    handleMouseMove = ({pageX, pageY}) => {

        //console.log({pageX, pageY});
        const {isPressed, topDeltaX, topDeltaY, selectedIndex} = this.state;


        if (isPressed && typeof selectedIndex === 'number' && this.player1.cards[selectedIndex].draggable) {

            const card = this.player1.cards[selectedIndex];
            const offset = card.stack.Offsets.get(card.instantKey);

            const mouseX = pageX - topDeltaX;
            const mouseY = pageY - topDeltaY;

            card.stack.Offsets.set(card.instantKey, {top: mouseY, left: mouseX, zIndex: offset.zIndex});

            this.setState({changed: true});
        }
    };

    handleMouseDown = (index, {pageX, pageY, button}) => {   //pos:the index of cardEl in position

        this.findTarget(index);
        const card = this.player1.cards[index];
        const {top, left} = card.stack.Offsets.get(card.instantKey);
        console.log(index, {top,left}, {pageX, pageY});          //pressX:
        this.setState({
            topDeltaX: pageX - left,
            topDeltaY: pageY - top,
            isPressed: !button,           //only react to left button (single click)
            selectedIndex: index,
        });
    };


    findTarget = (index) => {

        const card = this.player1.cards[index];


    };

    handleMouseUp = () => {

        const {selectedIndex} = this.state;

        if (typeof selectedIndex === 'number'&& this.state.dragTarget) {

            let card = this.player1.cards[selectedIndex];

            if (card.stack !== this.state.dragTarget) {

                if (this.state.dragTarget instanceof Pokemon) {
                    const pokemon = this.state.dragTarget;

                    let used = false;
                    if (card instanceof EnergyCard) {
                        pokemon.attachEnergy(card);
                        used = true;
                    }

                    if (card instanceof TrainerCard && card.attachable) {

                        pokemon.attachItem(card);
                        used = true;
                    }

                    if (card instanceof PokemonCard && card.attachable ) {
                        
                        if (pokemon.evolvableFrom(card)) {

                            console.log(pokemon.name);
                            pokemon.evolve(card);
                            console.log(pokemon.name);
                            used=true;
                        }
                        
                    }

                    if (used) {
                        card.stack.removeCard(card.instantKey);
                        card.stack = null;
                        card.zIndex = -1;
                    }

                    console.log("upgrade pokemon");

                } else {

                    card.stack.removeCard(card.instantKey);
                    console.log(card.stack.Offsets.size);
                    this.state.dragTarget.addCard(card.instantKey);

                    if (this.state.dragTarget === this.player1.bench) card = new Pokemon(card);

                    card.zIndex = this.state.dragTarget.Offsets.get(card.instantKey).zIndex;
                    card.stack = this.state.dragTarget;

                    this.player1.cards[selectedIndex] = card;

                }


            }

        }

        this.player1.hand.calculate({});
        this.player1.bench.calculate({});


        this.setState({isPressed: false, selectedIndex: null, dragTarget: null});

    };

    handleMouseOver = (index) => {
        const {isPressed} = this.state;
        const pokemon = this.player1.cards[index];
        if (isPressed && pokemon instanceof Pokemon) {

            this.state.dragTarget = pokemon;
            console.log("on Pokemon");
        }
    };

    onContextMenu = (i, event) => {
        event.preventDefault();

        if (this.player1.cards[i] instanceof Pokemon) {

            const energycards = this.player1.cards[i].detachEnergy();

            if (energycards&& energycards.length>0) {

                const card = energycards[0];

                this.player1.hand.addCard(card.instantKey);
                card.stack =  this.player1.hand;
                card.zIndex = this.player1.hand.Offsets.get(card.instantKey).zIndex;
            }

            this.player1.cards[i].heal(10);
        }
    };


    handleOnClick = (i) => {

        console.log( this.player1.cards[i] );

        if (this.player1.cards[i] instanceof Pokemon) {

            this.player1.cards[i].attachEnergy(randomCard(CARD_ENERGY));
            this.player1.cards[i].hurt(20);
        }

    };



    drawCards() {

        if (this.player1.deck.Offsets.size === 0) return;
        const topCardKey = this.player1.deck.popCard();
        this.player1.hand.addCard(topCardKey);

        for (let card of this.player1.cards) {

            if (card.instantKey === topCardKey) {
                card.stack = this.player1.hand;
                card.zIndex = this.player1.hand.Offsets.get(topCardKey).zIndex;
                card.draggable = true;
            }
        }

        this.setState({changed: true});
    }


    render() {
        const {isPressed, selectedIndex} = this.state;

        const userCardList = this.player1.cards.map((card, i) => {

            const active = selectedIndex === i && isPressed;

            const stack = card.stack;

            if (stack) {
                const offset = card.stack.Offsets.get(card.instantKey);
                card.zIndex = offset.zIndex;
                const face_down = stack.face_down;

                return (                                 //do not show attached cards
                    <div
                        onMouseDown={this.handleMouseDown.bind(null, i)}
                        //onMouseUp={this.handleMouseUp}
                        //onClick={this.handleOnClick.bind(null,i)}
                        //onContextMenu={this.onContextMenu.bind(null, i)}
                        onMouseOver={this.handleMouseOver.bind(null, i)}
                        onContextMenu={this.onContextMenu.bind(null, i)}
                        onClick={this.handleOnClick.bind(null,i)}
                        className="card-container"
                        key={card.instantKey} style={{zIndex: active ? 99 : offset.zIndex + 1}}>
                        {card instanceof Pokemon ? <PokemonView pokemon={card} width={stack.CardWidth}
                                                                x={offset.left}
                                                                y={offset.top}  attack={active}

                        /> : <CardView card={card} face_down={face_down} width={stack.CardWidth}
                                       x={offset.left}
                                       y={offset.top}

                        />}
                    </div>
                );
            } else {
                return null;
            }
        });

        return (
            <div className="welcome-content" ref={this.Board}>

                {userCardList}
                <Deck deck={this.player1.deck} onMouseOver={() => {
                    console.log('inDeck');
                }}/>

                <Bench bench={this.player1.bench} onMouseOver={() => {
                    const state = this.state;
                    const bench = this.player1.bench;
                    if (state.isPressed && state.dragTarget !== bench) {

                        const card = this.player1.cards[state.selectedIndex];

                        if (bench.Offsets.size < bench.Capacity && card instanceof PokemonCard && card.category === POKEMON_BASIC)
                            state.dragTarget = bench;

                        console.log('inBench');
                    }
                }}/>

                <Hand hand={this.player1.hand}/>

                <button onClick={() => this.drawCards()} style={{position: 'absolute', top: 700,}}>click</button>

            </div>
        );
    }
}

export default Board;