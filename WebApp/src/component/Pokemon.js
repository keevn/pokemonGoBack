import {abilityList} from "./mockData/data";
import {
    CARD_POKEMON,
    ENERGY_COLORLESS,
    POKEMON_BASIC,
    POKEMON_NORMAL,
    POKEMON_DEAD, CARD_ENERGY, POKEMON_STAGE_ONE, CARD_TRAINER, TRAINER_ITEM
} from "./constants";
import {Card} from "./Card";


export default class Pokemon {

    constructor(card) {
        if (!card) throw new Error("No card to be used to initial a pokemon");
        if (card.type !== CARD_POKEMON || card.category !== POKEMON_BASIC) throw new Error("Stage-one card can not be used to initialize a pokemon");
        this.name = card.name;
        this.type = CARD_POKEMON;
        this.category = card.category;
        this.hp = card.hp.value;
        this.energyCategory = card.hp.cat;
        this.retreat = card.retreat;
        this.abilities = Pokemon._attachedAbility(card);
        this.cardList = new Map();
        this.attachedEnergy = new Map();
        this.attachedItem = null;

        this.cardList.set(POKEMON_BASIC, card);
        this.damage = 0;
        this.status = POKEMON_NORMAL;

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

        this.toJson = this.toJson.bind(this);
    }

    static restore(cardIdList, damage, status) {
        const pokemon = new Pokemon(Card.getCardInstants(cardIdList[0]));

        pokemon.damage = damage;
        pokemon.status = status;

        for (let i = 1; i < cardIdList.length; i++) {
            const card = Card.getCardInstants(cardIdList[i]);
            if (card.type === CARD_ENERGY) pokemon.attachEnergy(card);
            if (card.type === CARD_POKEMON && card.category === POKEMON_STAGE_ONE) pokemon.evolve(card);
            if (card.type === CARD_TRAINER && card.category === TRAINER_ITEM) pokemon.attachItem();
        }
    }


    static _attachedAbility(card) {
        let abilities = Array();
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
            this.name = upgradeCard.name;

            this.category = upgradeCard.category;

            this.hp = upgradeCard.hp.value;
            this.energyCategory = upgradeCard.hp.cat;
            this.abilities = Pokemon._attachedAbility(upgradeCard);
            this.cardList.set(upgradeCard.category, upgradeCard);

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

        this.abilities.forEach((ability) => {

            if (this._abilityAvailable(ability.cost)) availableSills.push(ability);

        });

        return availableSills;

    }

    _abilityAvailable(cost) {

        let energyCounters = new Map();
        energyCounters[ENERGY_COLORLESS]=0;

        for (const [key, energyCard] of this.attachedEnergy) {

           energyCounters.colorless++;

            if (energyCounters.has(energyCard.category))
                energyCounters[energyCard.category]=energyCounters[energyCard.category] +1;
            else
                energyCounters[energyCard.category]=1;


        }

        let available = true;
        let costOfcolorless = 0;

        for (let i = 0; i < cost.length; i++) {
            let energy = cost[i];
            if (energy.cat !== ENERGY_COLORLESS) {
                if (energyCounters[energy.cat]) {
                    if ( energyCounters[energy.cat] < energy.value) {
                        available = false;
                        break;
                    } else {
                        energyCounters.colorless -= energy.value;
                    }
                } else {
                    available = false;
                    break;
                }

            } else {
                costOfcolorless = energy.value ; //save the colorless require for the end
            }
        }


        return (available && energyCounters.colorless >= costOfcolorless);
    }

    isRetreatable() {

        if (!this.retreat) return false;
        return this._abilityAvailable(this.retreat);

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
        this.cardList.push(energyCard);

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
        this.cardList.set(`${CARD_ENERGY}_${energyCard.key}`, energyCard);

    }

    detachEnergy(energyCategory, n = 1) {

        let i = 0;

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
            this.cardList.delete(`${CARD_ENERGY}_${deletedCard[j].key}`);
        }

        return deletedCard;

    }

    attachItem(itemCard) {

        this.attachedItem = itemCard;
        this.cardList.set(`${itemCard.category}_${itemCard.key}`, itemCard);

    }

    detachItem() {

        let itemCard = this.attachedItem;

        this.cardList.delete(`${itemCard.category}_${itemCard.key}`);

        this.attachedItem = null;

        return itemCard;
    }


    hurt(amount) {

        this.damage += amount;
        if (this.damage >= this.hp) {
            this.damage = this.hp;
            this.status = POKEMON_DEAD;
        }

    }

    heal(amount) {

        this.damage = this.damage < amount ? 0 : this.damage -= amount;

    }

    toJson() {

    }

}

