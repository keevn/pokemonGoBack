import {Card, EnergyCard, PokemonCard, TrainerCard} from "./Card";
import CardStack from "./CardStack";
import random from "lodash.random";
import Pokemon from "./Pokemon";
import {message} from "antd";
import {
    CARD_TRAINER,
    GLOW_POKEMON_IN_HAND,
    POKEMON_ASLEEP,
    POKEMON_BASIC,
    POKEMON_NORMAL,
    POKEMON_PARALYZED, POKEMON_STAGE_ONE,
    POKEMON_STUCK, TRAINER_ITEM, TRAINER_SUPPORTER
} from "../constants";
import {FlipCoin} from "../../util/Helpers";

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
        this.isBenchReady = false;
        this.mulligan = 0;

        this.isFirstHandPlayer = false;
        this.firstRound= true;

        this.turnWillFinish = false;
        this.turnFinished = false;
        this.energized = false;
        this.attacked = false;
        this.retreated = false;
        this.supported =false;
        this.cardDrawn = false;
        this.noCardtoDraw =false;     //set to true only in the beginning of turn if there is no card in beck

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
            card.cardIndex = i;
        });

        this.cards = cards;

    };

    resetPokemonState=(afterPokemonRest)=>{

        //const keys = [...Array.from(this.active.Cards.keys()),...Array.from(this.bench.Cards.keys())];

        const activePokemon = this.getActivePokemon();

        let callbackCounter=0;
        
        if  (activePokemon) {

            if (activePokemon.attachedItem)  {
                const itemCard = activePokemon.attachedItem;

                callbackCounter++;
                console.log(`Item found! doAbility(${itemCard.ability})`);
                callbackCounter--;
               // doAbility(itemCard.ability,()=>{
                //                     callbackCounter--;
                //                 });
            }

            activePokemon.isHealed = false;
            activePokemon.isNewInfField =false;
            if (activePokemon.isPoisoned) activePokemon.hurt(10);

            switch (activePokemon.status) {
                case POKEMON_STUCK:
                    activePokemon.setStatus(POKEMON_NORMAL);
                    break;
                case POKEMON_ASLEEP:
                    callbackCounter++;

                    FlipCoin(1, "If it‘s a Head,remove the asleep state",(result)=>{
                        if (result.head) activePokemon.setStatus(POKEMON_NORMAL);
                        callbackCounter--;
                    });

                    break;
                case POKEMON_PARALYZED:
                    activePokemon.setStatus(POKEMON_NORMAL);
                    break;
            }
        }

        const keys = [...Array.from(this.bench.Cards.keys())];

        for(let key of keys){
            const pokemon = this.cards[key];

            if (pokemon.attachedItem)  {
                const itemCard = pokemon.attachedItem;

                callbackCounter++;
                console.log(`Item found! doAbility(${itemCard.ability},pokemon)`);
                callbackCounter--;
                // doAbility(itemCard.ability,,()=>{
                //                     callbackCounter--;
                //                 });
            }

            pokemon.isHealed = false;
            pokemon.isNewInfField =false;
        }


        //block the program flow until all the callback functions above finished
        while (callbackCounter) {}

        afterPokemonRest();

    };


    resetTurn = () => {
        this.firstRound = false;
        this.turnWillFinish = false;
        this.turnFinished = false;
        this.energized = false;
        this.attacked = false;
        this.retreated = false;
        this.supported =false;
        this.cardDrawn = false;
        this.noCardtoDraw =false;
    };

    retreatableInTurn(){

        return !this.retreated && !(this.firstRound&&this.isFirstHandPlayer) && this.bench.Cards.size>=1;
    }
    
    attackableInTurn(){
        
        return !this.attacked && !(this.firstRound&&this.isFirstHandPlayer);
    }


    hasBasicPokemonInHand = () => {

        const basicPokemonIndex = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof PokemonCard && this.cards[key].category===POKEMON_BASIC) {
                basicPokemonIndex.push(key);
            }

        }
        return basicPokemonIndex.length>0;
    };

    hasStageOnePokemonInHand = () => {

        const stageOnePokemonIndex = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof PokemonCard && this.cards[key].category===POKEMON_STAGE_ONE) {
                stageOnePokemonIndex.push(key);
            }

        }
        return stageOnePokemonIndex.length>0;
    };

    getStageOnePokemonListFromHand =()=>{

        const stageOnePokemon = [];
        for (let key of this.hand.Cards.keys()){

            const card = this.cards[key];
            if (card instanceof PokemonCard && card.category===POKEMON_STAGE_ONE) {
                stageOnePokemon.push(card);
            }

        }
        return stageOnePokemon;
    };

    getAllBasicPokemonFromField =()=>{

         const pokemonList =[];
         const active =this.getActivePokemon();

        if (active.category===POKEMON_BASIC) pokemonList.push(active);

        for (let key of this.bench.Cards.keys()){

            const card = this.cards[key];
            if (card.category===POKEMON_BASIC) {
                pokemonList.push(card);
            }

        }

        return pokemonList;

    };

    hasItemCardInHand = () => {

        const itemCardIndex = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof TrainerCard && this.cards[key].category===TRAINER_ITEM) {
                itemCardIndex.push(key);
            }

        }
        return itemCardIndex.length>0;
    };

    hasSupportedCardInHand = () => {

        const supporterCardIndex = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof TrainerCard && this.cards[key].category===TRAINER_SUPPORTER) {
                supporterCardIndex.push(key);
            }

        }
        return supporterCardIndex.length>0;
    };


    hasActivePokemon =()=>{
        return this.active.Cards.size === 1 ;
    };

    hasPokemonInHand =()=>{

        //if (this.pitStop.Cards.size>0)

        return this.bench.Cards.size > 0 ;

    };

    getRandomPokemonFromBench =()=>{
        
        const pokemongKyes = Array.from(this.bench.Cards.keys());
        if (pokemongKyes.length>0) return this.cards[pokemongKyes[random(0,pokemongKyes.length-1)]];

        return null;

    };

    getActivePokemon = ()=>{
        const keys = Array.from(this.active.Cards.keys());
        return keys.length ? this.cards[keys[0]] : null;
    };

    getAllBenchPokemon = ()=>{
        
        const pokemons = [];
        for (let key of this.bench.Cards.keys()){
            pokemons.push(this.cards[key]);
        }

        return pokemons;

    };

    hasEnergyInHnad =()=>{
        const energyCard = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof EnergyCard) {
                energyCard.push(key);
            }

        }
        return energyCard.length>0;
    };

    getEnergyCardKey =()=>{

        const energyCard = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof EnergyCard) {
                energyCard.push(key);
            }

        }

        return energyCard[0];
    };

    getItemCardKey=()=>{

        const itemCard = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof TrainerCard && this.cards[key].category===TRAINER_ITEM) {
                itemCard.push(key);
            }

        }

        return itemCard[0];

    };

    getSupporterCardKey=()=>{

        const supporterCard = [];
        for (let key of this.hand.Cards.keys()){

            if (this.cards[key] instanceof TrainerCard && this.cards[key].category===TRAINER_SUPPORTER) {
                supporterCard.push(key);
            }

        }

        return supporterCard[0];

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
    };


    setOpponent(player) {
        this.opponent = player;
    }

    getOpponent() {
        return this.opponent;
    }


    //n: number of cards to be drawn
    draw = (to=this.hand) => {

        const ids = this.deck.popCardIds();


        if(ids)  {
            this.moveCard(this.deck,to, ids[0]);

            return true;
            
        } else

            return false;
        

    };


    moveCard = (sourceStack, targetStack, indexOfCard) => {


        if (targetStack===this.bench && this.bench.Cards.size === this.bench.Capacity)  return;

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
            this.energized=true;
            attached = true;

        }

        if (card instanceof TrainerCard && card.attachable) {

            pokemon.attachItem(card);

            attached = true;
        }

        if (card instanceof PokemonCard && card.attachable) {

            if (this.firstRound||pokemon.isNewInfField ) return false;
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
            card.stack = null;        
            sourceStack.calculate({});
        }

        return true;

    };

    discard =(indexOfCards)=>{

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
                    newPokemon.isNewInfField=true;

                    this.cards[key] = newPokemon;

                }

            }
        });

    };


    //n: times of coin to be flipped
    flip = (n = 1) => {
        //promise
    }

    //choose n card from the stack
    pick = (stack, n) => {
        //promise
    }


}