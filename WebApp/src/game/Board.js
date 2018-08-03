import React from 'react';
import {Affix, Button, message} from 'antd';
import './Welcome.css';
import './Board.css';
import {shuffle} from '../util/Helpers';
import {Card, EnergyCard, PokemonCard, randomCard, TrainerCard} from "../component/model/Card";
import Deck from '../component/Deck';
import Discard from '../component/Discard';
import Hand from '../component/Hand';
import Active from '../component/Active';
import CardStack from "../component/model/CardStack";
import CardView from "../component/CardView";
import PokemonView from "../component/PokemonView";
import Bench from "../component/Bench";
import Pokemon from "../component/model/Pokemon";
import {CARD_ENERGY, POKEMON_ASLEEP, POKEMON_BASIC, POKEMON_POISONED} from "../component/constants";



class Board extends React.Component {

    constructor(props) {
        super(props);


        this.userDeckCards = props.currentUser.deck.cardList.slice(0, 20);     //list of card id;

        this.aiDeckCards =  shuffle(this.userDeckCards.map((cardId)=>cardId));

        //console.log(userDeckCards);

        this.Board = React.createRef();

        this.state = {
            flipCoin: true,
            changed: false,
            currentPlayer: null,
            currentInOperating: null,
        };


        //create card stacks,include hand, bench, deck, prize card, discard pile, active spot, and pit stop;
        const user_hand = CardStack.getHand({x: 0, y: 570});
        const user_bench = CardStack.getBench({x: 0, y: 385});
        const user_deck = CardStack.getDeck({x: 260, y: 208});
        const user_active = CardStack.getActive({x: 0, y: 36});
        const user_discard = CardStack.getDiscard({x:260,y:35});


        const ai_hand = CardStack.getHand({x: 495, y: 5});
        const ai_bench = CardStack.getBench({x: 640, y: 170});
        const ai_deck = CardStack.getDeck({x: 880, y: 380});

        this.player1 = {

            deck: user_deck,
            hand: user_hand,
            bench: user_bench,
            active: user_active,
            discard:user_discard,
            opponent:null,
            cards:null,
        };

        this.player2={

            deck: ai_deck,
            hand: ai_hand,
            bench: ai_bench,
            cards: null,
            opponent:this.player1,
            
        };

        this.player1.opponent = this.player2;



        //initial all the deck cards
        const user_cards = this.userDeckCards.map(cardId => Card.getCardInstants(cardId));

        const ai_cards = this.aiDeckCards.map(cardId => Card.getCardInstants(cardId));

        if (true) {

            user_deck.calculate({Cards:user_cards});

            user_cards.forEach(card => {
                card.stack = user_deck;
                card.zIndex = user_deck.Offsets.get(card.instantKey).zIndex;
            });


            this.player1.cards=user_cards;

            ai_deck.calculate({Cards:ai_cards});

            ai_cards.forEach(card => {
                card.stack = ai_deck;
                card.zIndex = ai_deck.Offsets.get(card.instantKey).zIndex;
            });


            this.player2.cards=ai_cards;

        }



        //setting up for draggable feature
        this.state = Object.assign({}, this.state, {
            isPressed: false,
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

            const cardX = pageX - topDeltaX;
            const cardY = pageY - topDeltaY;

            card.stack.Offsets.set(card.instantKey, {top: cardY, left: cardX, zIndex: offset.zIndex});

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

    handleMouseUp = ({pageX, pageY}) => {

        console.log("mouse released", {pageX, pageY});
        const {selectedIndex,dragTarget} = this.state;

        let newPokemon=null;


        console.log("selectedIndex:",selectedIndex);

        //only  'if (selectedIndex)' is not enough ,since the index could be 0
        if (typeof selectedIndex === 'number'&& this.state.dragTarget) {
            let card = this.player1.cards[selectedIndex];



            if (card.stack !== dragTarget) {


                if (dragTarget instanceof Pokemon) {     //attach card onto a pokemon
                    const pokemon = dragTarget;

                    let used = false;
                    if (card instanceof EnergyCard) {
                        
                        pokemon.attachEnergy(card);
                        //energyCounter++;
                        used = true;
                    }

                    if (card instanceof TrainerCard && card.attachable) {

                        pokemon.attachItem(card);
                        used = true;
                    }

                    if (card instanceof PokemonCard && card.attachable ) {
                        
                        if (pokemon.evolvableFrom(card)) {

                            const oldName= pokemon.name;
                            pokemon.evolve(card);
                            used=true;

                            message.success(`${oldName} just evolved to ${pokemon.name}!`);
                        }
                        
                    }

                    if (used) {
                        card.stack.removeCard(card.instantKey);
                        card.stack = null;
                        card.zIndex = -1;
                    }

                    console.log("upgrade pokemon");

                } else {           // move card to different stack

                    card.stack.removeCard(card.instantKey);
                    //console.log(card.stack.Offsets.size);
                    dragTarget.addCard(card.instantKey);

                    if (dragTarget === this.player1.bench) {
                        
                        newPokemon = new Pokemon(card);

                        newPokemon.draggable=true;

                        
                    }

                    if (dragTarget === this.player1.active){

                        console.log(card);
                        if (card instanceof PokemonCard) {
                            newPokemon = new Pokemon(card);
                        }

                        card.draggable=false;
                    }

                    if (dragTarget === this.player1.pitstop){

                        card.draggable=false;
                    }



                    card.zIndex = dragTarget.Offsets.get(card.instantKey).zIndex;
                    card.stack = dragTarget;

                    
                }
            }

        }

        this.player1.hand.calculate({});
        this.player1.bench.calculate({});


        this.setState({isPressed: false, selectedIndex: null, dragTarget: null});

        if (newPokemon)  {
            //replace the card object with pokemon object after the card move animation

            newPokemon.zIndex = dragTarget.Offsets.get(newPokemon.instantKey).zIndex;
            newPokemon.stack = dragTarget;
            this.player1.cards[selectedIndex] = newPokemon;
            
        }

    };

    handleMouseOverOfPokemon = (index) => {
        const {isPressed,selectedIndex} = this.state;
        const pokemon = this.player1.cards[index];
        if (isPressed && index !==selectedIndex && pokemon instanceof Pokemon) {

            this.state.dragTarget = pokemon;
            console.log("on Pokemon");
        }
    };

    handleMouseOut = (index) => {
        const {isPressed} = this.state;
        const pokemon = this.player1.cards[index];
        if (isPressed && pokemon instanceof Pokemon) {

            this.state.dragTarget = null;
            console.log("out of  Pokemon");
        }
    };

    onContextMenu = (i, event) => {
        event.preventDefault();

        if ( this.player1.cards[i] instanceof Pokemon) {

           // const energycards = this.player1.cards[i].detachEnergy();

            /*if (false && energycards && energycards.length > 0) {

                const card = energycards[0];

                this.player1.hand.addCard(card.instantKey);
                card.stack = this.player1.hand;
                card.zIndex = this.player1.hand.Offsets.get(card.instantKey).zIndex;
            }*/

            this.player1.cards[i].setStatus(POKEMON_POISONED);
        }


    };


    handleOnClick = (i) => {

        console.log( this.player1.cards[i] );

        if (this.player1.cards[i] instanceof Pokemon) {

            this.player1.cards[i].attachEnergy(randomCard(CARD_ENERGY));
            this.player1.cards[i].hurt(20);
        }

    };



    drawCards =(player,event)=> {
        if (event) event.preventDefault();
        if (player.deck.Offsets.size === 0) return;
        const topCardKey = player.deck.popCard();
        player.hand.addCard(topCardKey);

        for (let card of player.cards) {

            if (card.instantKey === topCardKey) {
                card.stack = player.hand;
                card.zIndex = player.hand.Offsets.get(topCardKey).zIndex;
                if (player===this.player1) card.draggable = true;
            }
        }

        this.setState({changed: true});
    }

    reset =()=>{
        const user_cards = this.userDeckCards.map(cardId => Card.getCardInstants(cardId));

        this.player1.deck.reset({Cards:user_cards});

        user_cards.forEach(card => {
            card.stack = this.player1.deck;
            card.zIndex = this.player1.deck.Offsets.get(card.instantKey).zIndex;
        });

        this.player1.cards=user_cards;

        this.player1.bench.reset({});

        this.player1.active.reset({});
        
        this.player1.hand.reset({});
        this.player1.discard.reset({});

        this.setState({changed: true});
    };

    onAttack =(pokemon,ability)=>{
        console.log(pokemon.name,"do",ability.skill.id);
    };

    onRetreat =(pokemon)=>{
        console.log(pokemon.name,"retreat");



        const detachedCards = pokemon.retreat();



        for (const card of detachedCards) {

            this.player1.active.addCard(card.instantKey);
            card.stack = this.player1.active;
            card.zIndex = pokemon.zIndex-1;
            card.draggable=false;
        }


        this.forceUpdate();


        let i=0;
        for (const card of detachedCards) {

            setTimeout(()=>{
                this.player1.active.removeCard(card.instantKey);
                this.player1.discard.addCard(card.instantKey);
                card.stack = this.player1.discard;
                card.zIndex = this.player1.discard.Offsets.get(card.instantKey).zIndex;

                this.forceUpdate();
            },i*500);

            i++;
        }

        setTimeout(()=>{
            pokemon.stack.removeCard(pokemon.instantKey);

            this.player1.bench.addCard(pokemon.instantKey);
            pokemon.stack = this.player1.bench;
            pokemon.zIndex = this.player1.bench.Offsets.get(pokemon.instantKey).zIndex;

            this.forceUpdate();
        },i*500);


    }


    render() {
        const {isPressed, selectedIndex} = this.state;

        const userCardList = this.player1.cards? this.player1.cards.map((card, i) => {

            const active = selectedIndex === i && isPressed;

            const stack = card.stack;

            if (stack) {
                const offset = {...stack.Offsets.get(card.instantKey)};
                let zIndex = offset.zIndex + 1;
                if (active) zIndex=100;
                if (stack===this.player1.active) zIndex= 99;

                return (                                 //do not show attached cards
                    <div
                        onMouseDown={this.handleMouseDown.bind(null, i)}
                        //onMouseUp={this.handleMouseUp}
                        onMouseOver={this.handleMouseOverOfPokemon.bind(null, i)}
                        //onMouseOut={this.handleMouseOut.bind(null, i)}
                        onContextMenu={this.onContextMenu.bind(null, i)}
                        //onClick={this.handleOnClick.bind(null,i)}
                        className="card-container player"
                        key={card.instantKey} style={{zIndex: zIndex}}>
                        {card instanceof Pokemon ? <PokemonView pokemon={card} width={stack.CardWidth}
                                                                x={offset.left}
                                                                y={offset.top}  attack={stack===this.player1.active}
                                                                onAttack={this.onAttack}
                                                                onRetreat={this.onRetreat}  retreatalbe={this.player1.bench.Offsets.size}

                        /> : <CardView card={card} face_down={stack.face_down} width={stack.CardWidth}
                                       x={offset.left}
                                       y={offset.top}

                        />}
                    </div>
                );
            } else {
                return null;
            }
        }):null;

        const aiCardList = this.player2.cards? this.player2.cards.map((card, i) => {

            const active = false;

            const stack = card.stack;

            if (stack) {
                const offset = card.stack.Offsets.get(card.instantKey);

                return (                                 //do not show attached cards
                    <div
                        className="card-container"
                        key={card.instantKey} style={{zIndex: offset.zIndex + 1}}>
                        {card instanceof Pokemon ? <PokemonView pokemon={card} width={stack.CardWidth}
                                                                x={offset.left}
                                                                y={offset.top}  attack={active}

                        /> : <CardView card={card} face_down={stack.face_down} width={stack.CardWidth}
                                       x={offset.left}
                                       y={offset.top}   immediate={active}

                        />}
                    </div>
                );
            } else {
                return null;
            }
        }):null;


        const state = this.state;

        return <div className="welcome-content" ref={this.Board} >
            {userCardList}
            {aiCardList}

            <Active active={this.player1.active}
                    onMouseOver={() => {

                        const active = this.player1.active;
                        if (state.isPressed && state.dragTarget !== active) {

                            const card = this.player1.cards[state.selectedIndex];

                            if (active.Offsets.size < 1 && (card instanceof Pokemon||(card instanceof PokemonCard && card.category===POKEMON_BASIC)))
                                state.dragTarget = active;

                            console.log('inActive');
                        }
                    }}
            />

            <Deck deck={this.player1.deck}/>
            <Discard discard={this.player1.discard}/>

            <Bench bench={this.player1.bench} onMouseOver={() => {
                const bench = this.player1.bench;
                if (state.isPressed && state.dragTarget !== bench) {

                    const card = this.player1.cards[state.selectedIndex];

                    if (bench.Offsets.size < bench.Capacity && card instanceof PokemonCard && card.category === POKEMON_BASIC)
                        state.dragTarget = bench;

                    console.log('inBench');
                }
            }}/>

            <Hand hand={this.player1.hand}/>

            <Deck deck={this.player2.deck} className="ai"/>

            <Bench bench={this.player2.bench}/>

            <Hand hand={this.player2.hand}/>

            <Affix offsetBottom={200} style={{position: 'absolute', bottom: 100, right: 10}}>
                <Button onClick={(e) => this.drawCards(this.player1,e)}>click</Button>

                <Button onClick={(e) => this.drawCards(this.player2,e)}>AI click</Button>

                <Button onClick={(e) => this.reset()}>Reset</Button>
            </Affix>
        </div>;
    }
}



export default Board;