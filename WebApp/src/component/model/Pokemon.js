import {abilityList} from "../../mockData/data";
import {
    CARD_POKEMON,
    ENERGY_COLORLESS,
    POKEMON_BASIC,
    POKEMON_NORMAL,
    POKEMON_DEAD, CARD_ENERGY, POKEMON_POISONED, POKEMON_PARALYZED, POKEMON_ASLEEP,
} from "../constants";
import {Card, CardTypeError} from "./Card";


export default class Pokemon {


    constructor(card) {
        if (!card) throw new CardTypeError("We need a pokemon card to initial a pokemon");
        if (card.type !== CARD_POKEMON || card.category !== POKEMON_BASIC) throw new CardTypeError("Non basic card can not be used to initialize a pokemon");
        this.pic_id = card.id;
        this.key = card.key;
        this.name = card.name;
        this.type = CARD_POKEMON;
        this.category = card.category;
        this.hp = card.hp.value;
        this.energyCategory = card.hp.cat;
        this.retreatCost = card.retreat? card.retreat:[];
        this.abilities = Pokemon._getAttachedAbilities(card);
        this._manifest = new Map();            //the list all the cards the related to the current pokemon object
        this.attachedEnergy = new Map();
        this.attachedItem = null;
        this.effect = null;

        //These three properties below have the total information about a pokemon,
        // could be used to serialize this pokemon object
        this._manifest.set(POKEMON_BASIC, card);
        this.damage = 0;
        this.status = POKEMON_NORMAL;


        this.setStatus = this.setStatus.bind(this);
        this._abilityAvailable = this._abilityAvailable.bind(this);
        this.evolve = this.evolve.bind(this);
        this.evolvableFrom = this.evolvableFrom.bind(this);
        this.getAvailableSills = this.getAvailableSills.bind(this);
        this.isRetreatable = this.isRetreatable.bind(this);
        this.hurt = this.hurt.bind(this);
        this.heal = this.heal.bind(this);
        this.attachEnergy = this.attachEnergy.bind(this);
        this.detachEnergy = this.detachEnergy.bind(this);
        this.attachItem = this.attachItem.bind(this);
        this.detachItem = this.detachItem.bind(this);
        this.retreat = this.retreat.bind(this);

        this.toJson = this.toJson.bind(this);
    }

    static restore({cardIds, damage, status}) {
        let pokemon = null;

        for (const cardId of cardIds) {
            const card = Card.getCardInstants(cardId);
            pokemon = card.attachTo(pokemon);
            
        }

        pokemon.damage = damage;
        pokemon.status = status;

        return pokemon;
    }

    static restoreFromJson(jsonString){
        
       const pokeData = JSON.parse(jsonString);

       return Pokemon.restore(pokeData);

    }


    static _getAttachedAbilities(card) {
        let abilities = [];
        card.attacks.forEach(
            attack => {
                abilities.push({
                    "skill": abilityList[attack.ability],
                    "cost": attack.cost
                });
            });
        return abilities;
    }

    evolve(upgradeCard) {

        if (this.evolvableFrom(upgradeCard)) {
            this.pic_id = upgradeCard.id;
            this.name = upgradeCard.name;

            this.category = upgradeCard.category;

            this.hp = upgradeCard.hp.value;
            this.energyCategory = upgradeCard.hp.cat;
            this.abilities = Pokemon._getAttachedAbilities(upgradeCard);
            this._manifest.set(upgradeCard.category, upgradeCard);
            this.retreatCost = upgradeCard.retreat? upgradeCard.retreat:[];

            this.setStatus(POKEMON_NORMAL);
            
            return true;
        }

        return false;

    }

    evolvableFrom(upgradeCard) {

        if (upgradeCard.type !== CARD_POKEMON) return false;

        if (!upgradeCard.from) return false;

        return upgradeCard.from === this.name;

    }


    getAvailableSills() {


        let availableSills = [];

        if (this.status!==POKEMON_PARALYZED&&this.status!==POKEMON_ASLEEP) {

            this.abilities.forEach((ability) => {

                if (this._abilityAvailable(ability.cost)) availableSills.push(ability);

            });
        }

        return availableSills;

    }

    _abilityAvailable(cost) {

        let existEnergyCounters = new Map();
        existEnergyCounters[ENERGY_COLORLESS] = 0;

        for (const [key, energyCard] of this.attachedEnergy) {

            existEnergyCounters[ENERGY_COLORLESS]++;       //the colorless amount is actually the whole amount of attached energy cards

            (existEnergyCounters[energyCard.category]) ?
                existEnergyCounters[energyCard.category]++ :
                existEnergyCounters[energyCard.category] = 1;

        }

        let available = true;
        let costOfcolorless = 0;

        for (const requiredEnergy of cost) {
            if (requiredEnergy.cat !== ENERGY_COLORLESS) {     //calculation all the specific energy type requirement first
                if (existEnergyCounters[requiredEnergy.cat]) {
                    if (existEnergyCounters[requiredEnergy.cat] < requiredEnergy.value) {
                        available = false;
                        break;                              //if the amount of the specific energy the pokemon has is less than the requirement ,fail again
                    } else {
                        existEnergyCounters[ENERGY_COLORLESS] -= requiredEnergy.value;        //deduct the number of the specific one from the total energy amount
                    }
                } else {
                    available = false;                   //if the pokemon does not have the specific energy at all,fail directly
                    break;
                }

            } else {                               //leave the colorless require for the final judgment
                costOfcolorless = requiredEnergy.value;
            }
        }

        return (available && existEnergyCounters.colorless >= costOfcolorless);
    }

    isRetreatable() {

        if (this.status===POKEMON_NORMAL||this.status===POKEMON_POISONED) {

            if (!this.retreatCost.length) return true;
            return this._abilityAvailable(this.retreatCost);

        }else return false;

    }

    retreat(){

        if (!this.isRetreatable()) return;

        for (const cost of this.retreatCost){

            this.detachEnergy(cost.cat,cost.value);
        }

        this.setStatus(POKEMON_NORMAL);

    }

    /*attachEnergy(energyCard, ...properties){

        if (properties.length && typeof properties[0]['onBefore'] === "function") {

            let resultBefore = properties[0]['onBefore'](this);

            if (!resultBefore) {
                throw new Error("Error occurred before attach energy card");
                return false;
            }
        }

        this.attachedEnergy.push(energyCard);
        this._manifest.push(energyCard);

        if (properties.length && typeof properties[0]['onAfter'] === "function") {

            let resultBefore = properties[0]['onAfter'](this);

            if (!resultBefore) {
                throw new Error("Error occurred after attach energy card");
            }
        }

        return true;

    }*/

    attachEnergy(energyCard) {

        this.attachedEnergy.set(`${CARD_ENERGY}_${energyCard.key}`, energyCard);
        this._manifest.set(`${CARD_ENERGY}_${energyCard.key}`, energyCard);

    }

    detachEnergy(energyCategory, n = 1) {

        let i = 0;

        if (this.attachedEnergy.size===0) return;

        let deletedCard = [];

        if (energyCategory && energyCategory !== ENERGY_COLORLESS) {


            for (const [key, energyCard] of this.attachedEnergy) {
                if (energyCard.category === energyCategory) {
                    deletedCard[i] = energyCard;
                    i++;
                    if (i === n) break;
                }
            }


        } else {

            for (const [key, energyCard] of this.attachedEnergy) {
                deletedCard[i] = energyCard;
                i++;
                if (i === n) break;
            }
        }

        for (let j = 0; j < n; j++) {
            this.attachedEnergy.delete(`${CARD_ENERGY}_${deletedCard[j].key}`);
            this._manifest.delete(`${CARD_ENERGY}_${deletedCard[j].key}`);
        }

        return deletedCard;

    }

    attachItem(itemCard) {

        if (this.attachedItem!=null) {
            this.detachItem();
        }

        this.effect = itemCard.effect;
        this.attachedItem = itemCard;
        this._manifest.set(`${itemCard.category}`, itemCard);
        

    }

    detachItem() {

        let itemCard = this.attachedItem;

        this._manifest.delete(`${itemCard.category}`);

        this.attachedItem = null;
        this.effect = null;

        return itemCard;
    }


    hurt(amount) {

        this.damage += amount;
        if (this.damage >= this.hp) {
            this.damage = this.hp;
            this.setStatus(POKEMON_DEAD);
        }

    }

    heal(amount) {

        this.damage = this.damage < amount ? 0 : this.damage -= amount;

    }

    setStatus(status) {

        this.status = status;

    }

    toJson() {
        const pokemonData = {
            cardIds: [...this._manifest.values()].map((card)=>(card.id)),
            damage: this.damage,
            status: this.status
        };

        return JSON.stringify(pokemonData);
    }


}

