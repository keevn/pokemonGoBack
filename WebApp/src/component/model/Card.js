import {cardList} from '../mockData/data';
import {
    CARD_ENERGY,
    CARD_POKEMON,
    CARD_TRAINER,
    ENERGY_COLORLESS,
    POKEMON_BASIC ,
    ENERGY_DARKNESS
} from "../constants";
import Random from "random-id";

export class Card {
    constructor(id) {
        this._card = cardList[id];
        this.key =  Random(24);
        this.id = this._card.id;
        this.name = this._card.name;
        this.type = this._card.type;
        this.category = this._card.cat;
        this.attachable = false;
    }

    static getCardInstants(id){
        let card = new Card(id);
        switch (card.type) {
            case CARD_POKEMON: return new PokemonCard(id);
            case CARD_TRAINER: return new TrainerCard(id);
            case CARD_ENERGY: return new EnergyCard(id);
        }
    }
}

export class PokemonCard extends Card{
    constructor(id){
        super(id);
        if (this.type !== CARD_POKEMON) throw new CardTypeError();
        this.hp = this._card.hp;
        this.attacks= this._card.attacks;
        this.retreat= this._card.retreat;
        if (this._card.from) {               //stage-one pokemon, which is attachable
            this.from = this._card.from;
            this.attachable = true;
        }
    }
}

export class EnergyCard extends Card {
    constructor(id){
        super(id);
        if (this.type !== CARD_ENERGY) throw new CardTypeError();
        this.attachable = true;                                    //all energy card are attachable
    }
}


export class TrainerCard extends Card {

    constructor(id) {
        super(id);
        if (this.type !== CARD_TRAINER) throw new CardTypeError();
        this.ability = this._card.ability;
        this.attachable = (this.ability === 67) ;  //for now only ability 'Floral Crown' is attachable
    }

}

export function randomCard(type,category,attachable=false) {

    let find=false;
    let card;

    if (type===CARD_ENERGY && category===ENERGY_DARKNESS)
        throw new CardTypeError("darkness energy card does exist in current collection. ");

    while (!find) {

        let card_id = randomInteger(1,58);
        if (card_id==27 || card_id==42) continue;
        card = Card.getCardInstants(card_id);
        if (card.type && category && category!== ENERGY_COLORLESS)
            find = (card.type === type && card.category===category);
        else
            find = (card.type === type) ;

        if (find && attachable) {
            find = card.attachable;
        }

    }

    return card;

}

export function findBasicCard(stageOneCard){
    
    let card_id = 1;

    while (card_id < cardList.length) {

        const card = cardList[card_id];
        if (card.type === CARD_POKEMON && card.cat===POKEMON_BASIC && stageOneCard.from===card.name)
            break;
        else card_id++;
    }
    
    if (card_id === cardList.length)  return null;
    return Card.getCardInstants(card_id);
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export class CardTypeError extends Error {
    constructor(...args) {
        super(...args)

        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}


