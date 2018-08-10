import {abilityList} from "../mockData/data";
import {FlipCoin} from "../util/Helpers";
import random from "lodash.random";


const PICK = "pick";
const DAMAGE = "dam";
const FILP_COIN = "flip-coin";
const STATUS = "apply-status";
const COUNT = "count";
const DE_ENERGIZE = "deenergize";
const IS_HEALED = "isHealed";
const HEAL = "heal";
const DRAW = "draw";
const DISCARD = "discard";
const DE_STAT = "destat";
const RE_DAMAGE = "redamage";
const HAS_ENERGY = "hasEnergy";
const LOOK = "look";

export default class Ability {

    constructor(id, player = null) {

        this.ability = abilityList[id];
        this.id = this.ability.id;
        this.player = player;
        this.opponent = player.opponent;
        this.actionSequence = [];

        this.buildActionList();

    }

    buildActionList = () => {

        const actions = this.ability.actions;

        for (const action of actions) {

            let task = null;
            switch (action.act) {
                case DAMAGE:
                    task = (flip_result) => {

                        return new Promise((resolve) => {
                            this.dam(flip_result, action, resolve);
                        });

                    };
                    this.actionSequence.push(task);

                    break;
                case FILP_COIN:
                    task = () => {
                        return new Promise((resolve) => {
                            this.flip(action, resolve);
                        });
                    };

                    this.actionSequence.push(task);
                    break;

            }
        }


    };

    promiseSerial = () =>
        this.actionSequence.reduce((p, fn) => p.then(fn),
            Promise.resolve());


    dam = (previous_results, action, resolve) => {

        let flip_result = 0;

        if (previous_results && previous_results.length) {

            flip_result = previous_results[0].head;

        }

        const damage = action.value[flip_result];
        console.log("do damage:", action.value[flip_result]);

        let pokemons = [];

        const target=action.target === "your" ? this.player:this.opponent;

        const from =  Array.isArray(action.from)? action.from:[action.from];

        from.map(stack=>{
                 if (stack==="active") pokemons.push(target.getActivePokemon());
                 if (stack==="bench") pokemons.push(...target.getAllBenchPokemon());
        });

        let amount = 1;

        if (action.amount && action.amount === "all") {

            pokemons[random(0,pokemons.length-1)].hurt(damage);
            
        } else {
            
            pokemons.map((pokemon)=>{pokemon.hurt(damage);});

        }

        const next_results = previous_results ? [...previous_results, action.value[previous_results]] : [action.value[previous_results]];

        resolve(next_results);

    };

    flip = (action, resolve) => {
        const n = action.times;

        console.log("flip coin", n, "times");

        const callback = (value) => {
            resolve([value]);
        };

        //setTimeout(() => {
          //  callback(random(0, n));

        //}, 2000);

        FlipCoin(n, `Flip ${n} coin:`, callback);
    }

}