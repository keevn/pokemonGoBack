import {PokemonCard} from "../component/model/Card";
import {POKEMON_BASIC} from "../component/constants";
import random from "lodash.random";

export default class AI {
    
      static pickPokemonFromHand(hand,cards){

          const basicPokemonIndex = [];
          for (let key of hand.Cards.keys()){

               if (cards[key] instanceof PokemonCard && cards[key].category===POKEMON_BASIC) {
                   basicPokemonIndex.push(key);
               }

          }

          const randomIndex = random(0,basicPokemonIndex.length-1);

          return basicPokemonIndex[randomIndex];
      }
}