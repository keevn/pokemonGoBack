import {cardList} from './mockData/data';
import {CARD_ENERGY, CARD_POKEMON, CARD_TRAINER, ENERGY_COLORLESS, POKEMON_BASIC, POKEMON_STAGE_ONE} from "./constants";

export class Card {
    constructor(id) {
        this._card = cardList[id];
        this.id = this._card.id;
        this.name = this._card.name;
        this.type = this._card.type;
        this.category = this._card.cat;
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
        if (this._card.from) this.from = this._card.from;
    }
}

export class EnergyCard extends Card {
    constructor(id){
        super(id);
        if (this.type !== CARD_ENERGY) throw new CardTypeError();
    }
}


export class TrainerCard extends Card {

    constructor(id) {
        super(id);
        if (this.type !== CARD_TRAINER) throw new CardTypeError();
        this.ablility = this._card.ablility;
    }

}

export function randomCard(type,category) {

    let find=false;
    let card_id = 0;



    while (!find) {
        
        const card = cardList[randomInteger(1,58)];
        if (category && category!= ENERGY_COLORLESS)
            find = (card.type === type && card.cat===category);
        else
            find = (card.type === type) ;


        if (find) card_id = card.id;

    }

    return Card.getCardInstants(card_id);

}

export function findBasicCard(stageOneCard){
    
    let card_id = 1;

    while (true && card_id<cardList.length) {

        const card = cardList[card_id];
        if (card.type === CARD_POKEMON && card.cat===POKEMON_BASIC && stageOneCard.from===card.name)
            break;
        else card_id++;
    }

    console.log(card_id,cardList.length);
    
    if (card_id == cardList.length)  return null;
    return Card.getCardInstants(card_id);
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}