import Pokemon from "../model/Pokemon";
import {CARD_POKEMON, POKEMON_BASIC} from "../constants";
import {randomCard} from "../model/Card";
import AI from '../../AI/AI';

test('findThePokeomonToAttachEnergy()', ()=> {

    const basic_pokemonCard1= randomCard(CARD_POKEMON,POKEMON_BASIC);
    const pokemon1 = new Pokemon(basic_pokemonCard1);
    pokemon1.hurt(20);

    const basic_pokemonCard2= randomCard(CARD_POKEMON,POKEMON_BASIC);
    const pokemon2 = new Pokemon(basic_pokemonCard2);
    pokemon2.hurt(40);

    const pokomonlist=[pokemon1,pokemon2];

    const result= AI.findThePokeomonToAttachEnergy(pokomonlist);

    expect(result).toBe(pokemon2);                  

});