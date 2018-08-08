import {Card, EnergyCard, PokemonCard, TrainerCard} from "./Card";
import CardStack from "./CardStack";
import random from "lodash.random";
import Pokemon from "./Pokemon";
import {message} from "antd";
import {POKEMON_BASIC,GLOW_POKEMON_IN_HAND} from "../constants";

export default class Player {

    constructor(user, deckCards, deck, hand, bench, prize, discard, active, pitStop, shuffle = false) {
        this.name = user.name;
        this.id = user.id;
        this.cardIds = deckCards;
        this.cards = null;
        this.deck = deck;
        this.hand = hand;
        this.bench = bench;
        this.active = active;
        this.prize = prize;
        this.discard = discard;
        this.pitStop = pitStop;
        this.shuffle = shuffle;


        this.opponent = null;
        this.component = null;
        this.isFirstHandPlayer = false;
        this.hasActivePokemon = false;
        this.isBenchReady = false;
        this.firstRound=true;
        this.mulligan = 0;
        this.turnFinished = false;

    }

    static getPlayer(user, deckCards = null, shuffle = false) {
        const deck = CardStack.getDeck({x: 260, y: 208}, deckCards);
        const hand = CardStack.getHand({x: 0, y: 570}, false, true);        //face up, draggable
        const bench = CardStack.getBench({x: 0, y: 385}, false, true);      //face up,draggable
        const active = CardStack.getActive({x: 0, y: 36}, false);           //face up
        const discard = CardStack.getDiscard({x: 260, y: 35});
        const prize = CardStack.getPrize({x: 387, y: 175});
        const pitStop = CardStack.getPitStop({x: 640, y: 390});

        return new Player(user, deckCards, deck, hand, bench, prize, discard, active, pitStop, shuffle);
    }

    static getAIPlayer(user, deckCards = null, shuffle = false) {

        const deck = CardStack.getDeck({x: 895, y: 355}, deckCards);
        const hand = CardStack.getHand({x: 500, y: 5}, true, false);           //face down,not draggable
        const bench = CardStack.getBench({x: 645, y: 170}, true, false);        //face down, not draggable
        const active = CardStack.getActive({x: 1020, y: 360}, true);           //face down
        const discard = CardStack.getDiscard({x: 895, y: 530});
        const prize = CardStack.getPrize({x: 768, y: 390});
        const pitStop = CardStack.getPitStop({x: 515, y: 175});

        return new Player(user, deckCards, deck, hand, bench, prize, discard, active, pitStop, shuffle);

    }

    initialDeck = () => {


        const cards = this.cardIds.map(cardId => Card.getCardInstants(cardId));
        this.deck.calculate({Cards: cards});


        if (this.shuffle) this.deck.shuffle();

        cards.forEach((card, i) => {
            const locationInfo = this.deck.Cards.get(i);
            card.stack = this.deck;
            card.zIndex = locationInfo.zIndex;
            card.x = locationInfo.left;
            card.y = locationInfo.top;
        });

        this.cards = cards;

    };


    resetTurn = (firstTurn = false) => {

        if (firstTurn) {
            //int firstTurn the first hand player can not attack


        }
        console.log(this.name, "reset turn, firstTurn:", firstTurn);

    };


    hasBasicPokemonInHand = () => {

        const basicPokemonIndex = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof PokemonCard && this.cards[key].category===POKEMON_BASIC) {
                basicPokemonIndex.push(key);
            }

        }
        return basicPokemonIndex.length>0;
    };

    glowCards = (cond)=>{

        switch (cond) {
            case GLOW_POKEMON_IN_HAND:

                for (let key of this.hand.Cards.keys()){

                    if (this.cards[key] instanceof PokemonCard && this.cards[key].category===POKEMON_BASIC) {
                        this.cards[key].glow=true;
                    }

                }
                break;

        }
    };

    resetGlowness =()=>{
        
        this.cards.map((card)=>{
            card.glow=false;
        });
    }



    pickActive = () => {
        return new Promise((resolve) => {

            console.log("AI first turn move.");

        });

    };

    setComponent(Component) {
        this.component = Component;
    }

    setOpponent(player) {
        this.opponent = player;
    }

    getOpponent() {
        return this.opponent;
    }


    //n: number of cards to be drawn
    draw = (to=this.hand) => {

        const ids = this.deck.popCardIds();


        if(ids)  this.moveCard(this.deck,to, ids[0]);
        

    };


    moveCard = (sourceStack, targetStack, indexOfCard) => {


        if (targetStack===this.bench && this.bench.Cards.size ===this.bench.Capacity)  return;

        let card = this.cards[indexOfCard];

        sourceStack.removeCard(indexOfCard);

        targetStack.addCard(indexOfCard);

        card.stack = targetStack;

        card.zIndex = 99;  //temporarily move to the top of stack before moving animations

        sourceStack.calculate({});
        targetStack.calculate({});

    };

    setActive = (indexOfCard) =>{

        let card = this.cards[indexOfCard];

        this.cards[indexOfCard] = new Pokemon(card) ;

        this.moveCard(card.stack,this.active,indexOfCard);

    };

    attachToPokemon = (pokemon, indexOfCards) => {

        let card = this.cards[indexOfCards];

        let attached = false;
        if (card instanceof EnergyCard) {

            pokemon.attachEnergy(card);
            attached = true;

        }

        if (card instanceof TrainerCard && card.attachable) {

            pokemon.attachItem(card);
            attached = true;
        }

        if (card instanceof PokemonCard && card.attachable) {

            if (this.firstRound||pokemon.isNewInfField) return false;
            if (pokemon.evolvableFrom(card)) {

                const oldName = pokemon.name;
                pokemon.evolve(card);
                attached = true;

                message.success(`${oldName} just evolved to ${pokemon.name}!`);
            }

        }

        if (attached) {
            const sourceStack = card.stack;
            sourceStack.removeCard(indexOfCards);
            card.zIndex = 99;    //temporarily move to the top of stack before moving animations
            card.x = pokemon.x;
            card.y = pokemon.y;
            sourceStack.calculate({});
        }

        return true;

    };

    pokemonlize=()=>{

        [this.bench,this.active].map((stack)=>{
            
            for (let key of stack.Cards.keys()){

                if (this.cards[key] instanceof PokemonCard && this.cards[key].category===POKEMON_BASIC) {
                    const card = this.cards[key];
                    const newPokemon =  new Pokemon(card);

                    newPokemon.zIndex = card.zIndex;
                    newPokemon.x= card.x;
                    newPokemon.y= card.y;
                    newPokemon.stack= stack;

                    this.cards[key] = newPokemon;

                }

            }
        });

    }


    //n: times of coin to be flipped
    flip = (n = 1) => {
        //promise
    }

    //choose n card from the stack
    pick = (stack, n) => {
        //promise
    }


}