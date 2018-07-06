import Pokemon from "../Pokemon";
import {Card, randomCard} from "../Card";
import {abilityList} from "../mockData/data";
import {CARD_ENERGY, CARD_POKEMON, ENERGY_WATER, POKEMON_BASIC, POKEMON_STAGE_ONE} from "../constants";

test('Pokemon() initial a basic pokemon', ()=> {

    const pokemoncard= randomCard(CARD_POKEMON,POKEMON_BASIC);

    const pokemon= new Pokemon(pokemoncard);

    expect(pokemon).toBeInstanceOf(Pokemon);

});

test('Pokemon() can not be initialized by a stage-one pokemon', ()=> {

    const pokemoncard= randomCard(CARD_POKEMON,POKEMON_STAGE_ONE);

    const t = () => {
        new Pokemon(pokemoncard) ;
    };

    expect(t).toThrow("Stage-one card can not be used to initialize a pokemon");

});

test('_attachedAbility() :generate ablility list from a pokemon', ()=> {

    const pokemoncard= Card.getCardInstants(11);

    const abilities = Pokemon._attachedAbility(pokemoncard);

    expect(abilities.length).toBe(2);
    expect(abilities[0].skill).toEqual(abilityList[17]);
    expect(abilities[1].skill).toEqual(abilityList[18]);
});

test('evolvableFrom() : able to evolve from stage-one PokemonCard', ()=> {

    const upgradecard= Card.getCardInstants(4);
    const pokemoncard= Card.getCardInstants(3);

    const pokemon= new Pokemon(pokemoncard);
    
    expect(pokemon.evolvableFrom(upgradecard)).toBeTruthy();

});

test('evolve() : evolve from stage-one PokemonCard', ()=> {

    const upgradecard= Card.getCardInstants(4);
    const pokemoncard= Card.getCardInstants(3);

    const pokemon= new Pokemon(pokemoncard);

    const old_skillList = pokemon.abilities;

    pokemon.evolve(upgradecard);

    expect(pokemon.category).toBe(POKEMON_STAGE_ONE);
    expect(pokemon.abilities).not.toBe(old_skillList);

});

test('attachEnergy() : add a energy card to a basic Pokemon', ()=> {

    const pokemoncard= randomCard(CARD_POKEMON,POKEMON_BASIC);
    const energy= randomCard(CARD_ENERGY);

    const pokemon= new Pokemon(pokemoncard);

    const energyNumber = pokemon.attachedEnergy.length;

    pokemon.attachEnergy(energy);

    expect(pokemon.attachedEnergy).toContain(energy);
    expect(pokemon.attachedEnergy.length).toBe(energyNumber+1);

});

test('attachEnergy() : add a energy card to a stage-one Pokemon', ()=> {

    const pokemoncard= randomCard(CARD_POKEMON,POKEMON_BASIC);
    const energy= randomCard(CARD_ENERGY);

    const pokemon= new Pokemon(pokemoncard);

    const energyNumber = pokemon.attachedEnergy.length;

    pokemon.attachEnergy(energy);

    expect(pokemon.attachedEnergy).toContain(energy);
    expect(pokemon.attachedEnergy.length).toBe(energyNumber+1);

});




