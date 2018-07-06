import {abilityList} from "./mockData/data";
import {
    CARD_POKEMON,
    ENERGY_COLORLESS,
    POKEMON_BASIC,
    POKEMON_NORMAL,
    POKEMON_DEAD, CARD_ENERGY, POKEMON_STAGE_ONE, CARD_TRAINER, TRAINER_ITEM
} from "./constants";
import {Card} from "./Card";
import {removeElementFromArray} from '../util/Helpers'




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
        this.attachedEnergy = [];
        this.attachedItem = null;
        
        this.cardList=[card];
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
    }

    static restore(cardIdList,damage,status){
        const pokemon = new Pokemon(Card.getCardInstants(cardIdList[0]));

        pokemon.damage = damage;
        pokemon.status = status;

        for (let i=1;i < cardList.length;i++){
            const card = Card.getCardInstants(cardIdList[i]);
            if (card.type===CARD_ENERGY) pokemon.attachEnergy(card);
            if (card.type===CARD_POKEMON && card.category===POKEMON_STAGE_ONE) pokemon.evolve(card);
            if (card.type===CARD_TRAINER && card.category===TRAINER_ITEM) pokemon.attachItem();
        }
    }


    static _attachedAbility(card) {
        let abilities = Array();
        card.attacks.forEach(
            attack => {
                abilities.push({
                    "skill": abilityList[attack.ablility],
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
            this.cardList.push(upgradeCard);

            return true;
        }

        return false;

    }

    evolvableFrom(upgradeCard) {

        if (upgradeCard.type !== CARD_POKEMON) return false;

        if (!upgradeCard.from)  return false;
        
        return upgradeCard.from === this.name;

    }


    getAvailableSills() {


        let availableSills = [];

        this.abilities.forEach((ability) => {

            if (this._abilityAvailable(ability.cost)) availableSills.push(ability);

        });

        return availableSills;

    }

    _abilityAvailable(cost){

        let energyCounters = {colorless: 0};


        this.attachedEnergy.forEach((energy) => {
            energyCounters.colorless++;
            energyCounters[energy.cat]++;
        });

        let available = true;

        for (let i = 0; i < cost.length; i++) {
            let energy = cost[i];
            if (energy.cat !== ENERGY_COLORLESS) {
                if (energyCounters[energy.cat] < energy.value) {
                    available = false;
                    break;
                } else {
                    energyCounters.colorless -= energy.value;
                }
            } else {
                energyCounters.colorless -= energy.value;
            }
        }
        return (available && energyCounters.colorless >= 0);
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

    attachEnergy(energyCard){

        this.attachedEnergy.push(energyCard);
        this.cardList.push(energyCard);
        
    }

    detachEnergy(energyCategory){

        let energyCard;

        if (energyCategory && energyCategory !== ENERGY_COLORLESS){

            for (let i=0;i<this.attachedEnergy.length;i++){
                 if (this.attachedEnergy[i].category===energyCategory)
                     energyCard =  removeElementFromArray(this.attachedEnergy,this.attachedEnergy[i]);
            }

            removeElementFromArray(this.cardList,energyCard);

        }else{

            this.attachedEnergy.pop();
            energyCard = this.cardList.pop();
        }

         return energyCard;
          
    }

    attachItem(itemCard){

       this.attachedItem=itemCard;
       this.cardList.push(itemCard);

    }

    detachItem(){

        let itemCard = removeElementFromArray(this.cardList,this.attachedItem);

        this.attachedItem =null ;

        return itemCard;
    }


    hurt(amount) {

        this.damage += amount;
        if (this.damage>=this.hp) {
            this.damage = this.hp;
            this.status=POKEMON_DEAD;
        }

    }

    heal(amount){

        this.damag = this.damage < amount? 0:this.damage-=amount;

    }
    

}

