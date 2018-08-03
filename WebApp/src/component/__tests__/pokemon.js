import Pokemon from "../model/Pokemon";
import {Card, CardTypeError, EnergyCard, findBasicCard, randomCard, TrainerCard} from "../model/Card";
import {abilityList} from "../../mockData/data";
import {
    CARD_ENERGY,
    CARD_POKEMON,
    ENERGY_WATER,
    POKEMON_BASIC,
    POKEMON_STAGE_ONE,
    POKEMON_DEAD,
    POKEMON_NORMAL,
    CARD_TRAINER,
    TRAINER_ITEM,
    ENERGY_LIGHTNING,
    ENERGY_DARKNESS,
    ENERGY_FIGHT,
    POKEMON_ASLEEP,
    POKEMON_PARALYZED, POKEMON_POISONED
} from "../constants";

test('Pokemon() initial a basic pokemon', () => {

    const pokemoncard = randomCard(CARD_POKEMON, POKEMON_BASIC);

    const pokemon = new Pokemon(pokemoncard);

    expect(pokemon).toBeInstanceOf(Pokemon);

});

test('Pokemon() can not be initialized by a stage-one pokemon', () => {

    const pokemoncard = randomCard(CARD_POKEMON, POKEMON_STAGE_ONE);

    const t = () => {
        new Pokemon(pokemoncard);
    };

    expect(t).toThrow(CardTypeError);

});

test('_getAttachedAbilities() : ability list of a pokemon cardEl', () => {

    const pokemoncard = Card.getCardInstants(11);

    const abilities = Pokemon._getAttachedAbilities(pokemoncard);

    expect(abilities.length).toBe(2);
    expect(abilities[0].skill).toEqual(abilityList[17]);
    expect(abilities[1].skill).toEqual(abilityList[18]);
});

test('evolvableFrom() : able to evolve from stage-one PokemonCard', () => {

    const upgradecard = Card.getCardInstants(4);
    const pokemoncard = Card.getCardInstants(3);

    const pokemon = new Pokemon(pokemoncard);

    expect(pokemon.evolvableFrom(upgradecard)).toBeTruthy();

});

test('evolve() : evolve from stage-one PokemonCard', () => {

    const upgradecard = Card.getCardInstants(4);
    const pokemoncard = Card.getCardInstants(3);

    const pokemon = new Pokemon(pokemoncard);

    const old_skillList = pokemon.abilities;

    pokemon.evolve(upgradecard);

    expect(pokemon.category).toBe(POKEMON_STAGE_ONE);
    expect(pokemon.abilities).not.toBe(old_skillList);

});

test('attachEnergy() : add a energy cardEl to a basic Pokemon', () => {

    const pokemoncard = randomCard(CARD_POKEMON, POKEMON_BASIC);
    const energy = randomCard(CARD_ENERGY);

    const pokemon = new Pokemon(pokemoncard);

    const energyNumber = pokemon.attachedEnergy.size;

    pokemon.attachEnergy(energy);

    expect(pokemon.attachedEnergy.get(`${CARD_ENERGY}_${energy.instantKey}`)).toEqual(energy);
    expect(pokemon.attachedEnergy.size).toBe(energyNumber + 1);

});

test('attachEnergy() : add repeated key energycard', () => {

    const stageonecard = randomCard(CARD_POKEMON, POKEMON_STAGE_ONE);

    const pokemoncard = findBasicCard(stageonecard);

    let energy = randomCard(CARD_ENERGY);

    const pokemon = new Pokemon(pokemoncard);

    const cardNumber = pokemon._manifest.size;

    const energyNumber = pokemon.attachedEnergy.size;

    const key1 = energy.key;

    pokemon.attachEnergy(energy);

    pokemon.evolve(stageonecard);

    // energy= randomCard(CARD_ENERGY);                        //if energy cardEl's key is the same ,only attach once
    pokemon.attachEnergy(energy);

    expect(pokemon.attachedEnergy.get(key1)).not.toBeNull();
    expect(pokemon.attachedEnergy.size).toBe(energyNumber + 1);
    expect(pokemon._manifest.size).toBe(cardNumber + 2);    //there is a pokemon cardEl in the front of cardlist
});

test('attachEnergy() : add a energy cardEl to after evolve Pokemon', () => {

    const stageonecard = randomCard(CARD_POKEMON, POKEMON_STAGE_ONE);

    const pokemoncard = findBasicCard(stageonecard);

    let energy = randomCard(CARD_ENERGY);

    const key1 = energy.instantKey;

    const pokemon = new Pokemon(pokemoncard);

    const cardNumber = pokemon._manifest.size;

    const energyNumber = pokemon.attachedEnergy.size;

    pokemon.attachEnergy(energy);

    pokemon.evolve(stageonecard);

    energy = randomCard(CARD_ENERGY);
    const key2 = energy.instantKey;

    pokemon.attachEnergy(energy);

    expect(pokemon.attachedEnergy.has(`${CARD_ENERGY}_${key1}`)).toBeTruthy();
    expect(pokemon.attachedEnergy.has(`${CARD_ENERGY}_${key2}`)).toBeTruthy();
    expect(pokemon.attachedEnergy.size).toBe(energyNumber + 2);
    expect(pokemon._manifest.size).toBe(cardNumber + 3);    //there is a pokemon cardEl in the front of cardlist
});


test('detachEnergy() : remove a energy card to Pokemon', () => {

    const pokemoncard = randomCard(CARD_POKEMON, POKEMON_BASIC);
    let energy = randomCard(CARD_ENERGY, ENERGY_WATER);
    const key1=energy.instantKey;

    const pokemon = new Pokemon(pokemoncard);

    const energyNumber = pokemon.attachedEnergy.size;
    const cardNumber = pokemon._manifest.size;

    pokemon.attachEnergy(energy);

    energy = randomCard(CARD_ENERGY, ENERGY_WATER);
    const key2=energy.instantKey;
    pokemon.attachEnergy(energy);

    expect(pokemon.attachedEnergy.size).toBe(energyNumber + 2);
    expect(pokemon._manifest.size).toBe(cardNumber + 2);


    const removedEnergy = pokemon.detachEnergy();

    expect(removedEnergy[0].instantKey).toBe(key1);

    expect(pokemon.attachedEnergy.size).toBe(energyNumber + 1);
    expect(pokemon._manifest.size).toBe(cardNumber + 1);


    energy = randomCard(CARD_ENERGY, ENERGY_WATER);
    const key3=energy.instantKey;
    pokemon.attachEnergy(energy);

    energy = randomCard(CARD_ENERGY, ENERGY_FIGHT);
    pokemon.attachEnergy(energy);

    let removedEnergys = pokemon.detachEnergy(ENERGY_WATER, 2);

    expect(removedEnergys[0].instantKey).toBe(key2);
    expect(removedEnergys[1].instantKey).toBe(key3);
    expect(pokemon.attachedEnergy.size).toBe(energyNumber+1);
    expect(pokemon._manifest.size).toBe(cardNumber+1);

    energy = randomCard(CARD_ENERGY, ENERGY_WATER);
    const key4=energy.instantKey;
    pokemon.attachEnergy(energy);

    removedEnergys = pokemon.detachEnergy(ENERGY_WATER, 2);
    expect(removedEnergys.length).toBe(1);
    expect(pokemon.attachedEnergy.size).toBe(energyNumber+1);
    expect(pokemon._manifest.size).toBe(cardNumber+1);

    pokemon.detachEnergy();
    expect(pokemon.attachedEnergy.size).toBe(energyNumber);
    expect(pokemon._manifest.size).toBe(cardNumber);

});


test('attachItem() : attach itemcard this pokemon', () => {

    const pokemoncard = randomCard(CARD_POKEMON, POKEMON_BASIC);

    const pokemon = new Pokemon(pokemoncard);

    const itemcard = randomCard(CARD_TRAINER, TRAINER_ITEM, true);

    if (itemcard.attachable) pokemon.attachItem(itemcard);

    expect(pokemon.attachedItem).toBeInstanceOf(TrainerCard);
    expect(pokemon._manifest.size).toBe(2);
    expect(pokemon._manifest.get(`${pokemon.attachedItem.category}`)).toEqual(pokemon.attachedItem);


    const t = () => {

        pokemon.attachItem(itemcard);
        
    };

    expect(pokemon._manifest.get(`${pokemon.attachedItem.category}`)).toEqual(pokemon.attachedItem);


});

test('detachItem() : detach itemcard from pokemon', () => {

    const pokemoncard = randomCard(CARD_POKEMON, POKEMON_BASIC);

    const pokemon = new Pokemon(pokemoncard);

    const itemcard = randomCard(CARD_TRAINER, TRAINER_ITEM, true);

    if (itemcard.attachable) pokemon.attachItem(itemcard);

    expect(pokemon.attachedItem).toBeInstanceOf(TrainerCard);
    expect(pokemon._manifest.size).toBe(2);

    const removedItem = pokemon.detachItem();

    expect(pokemon._manifest.size).toBe(1);
    expect(removedItem).toBeInstanceOf(TrainerCard);

});


test('hurt(hp) : attack this pokemon', () => {

    const pokemoncard = randomCard(CARD_POKEMON, POKEMON_BASIC);

    const pokemon = new Pokemon(pokemoncard);

    const damageBeforeAttack = pokemon.damage;

    pokemon.hurt(20);

    expect(pokemon.damage).toBe(damageBeforeAttack + 20);


    pokemon.hurt(pokemon.hp + 20);


    expect(pokemon.damage).toBe(pokemon.hp);
    expect(pokemon.status).toBe(POKEMON_DEAD);

});

test('heal(hp) : heal this pokemon', () => {

    const pokemoncard = randomCard(CARD_POKEMON, POKEMON_BASIC);

    const pokemon = new Pokemon(pokemoncard);

    pokemon.hurt(20);


    pokemon.heal(10);

    expect(pokemon.damage).toBe(10);

    pokemon.heal(30);

    expect(pokemon.damage).toBe(0);
    expect(pokemon.status).toBe(POKEMON_NORMAL);


});


test('getAvailableSills() : find available skill list', () => {

    const stageone = Card.getCardInstants(12);


    const pokemoncard = findBasicCard(stageone);

    const pokemon = new Pokemon(pokemoncard);

    pokemon.evolve(stageone);

    pokemon.attachEnergy(randomCard(CARD_ENERGY, ENERGY_FIGHT));
    pokemon.attachEnergy(randomCard(CARD_ENERGY, ENERGY_FIGHT));
    expect(pokemon.attachedEnergy.size).toBe(2);
    expect(pokemon.getAvailableSills().length).toBe(1);


    pokemon.attachEnergy(randomCard(CARD_ENERGY, ENERGY_WATER));

    expect(pokemon.attachedEnergy.size).toBe(3);

    pokemon.attachEnergy(randomCard(CARD_ENERGY));

    expect(pokemon.attachedEnergy.size).toBe(4);
    const skills = pokemon.getAvailableSills();
    expect(skills.length).toBe(2);
    expect(skills[0].skill.id).toBe(19);


});

test('isRetreatable() ', () => {

    const pokemoncard = Card.getCardInstants(47);

    const pokemon = new Pokemon(pokemoncard);

    pokemon.attachEnergy(randomCard(CARD_ENERGY));

    expect(pokemon.isRetreatable()).toBeTruthy();

    pokemon.detachEnergy();

    expect(pokemon.isRetreatable()).not.toBeTruthy();


});

test('retreat() ', () => {

    const pokemoncard = Card.getCardInstants(18);

    const pokemon = new Pokemon(pokemoncard);

    pokemon.attachEnergy(randomCard(CARD_ENERGY));
    pokemon.attachEnergy(randomCard(CARD_ENERGY));
    pokemon.setStatus(POKEMON_PARALYZED);
    pokemon.isPoisoned=true;

    expect(pokemon.isRetreatable()).not.toBeTruthy();

    pokemon.setStatus(POKEMON_POISONED);
    pokemon.retreat();

    expect(pokemon.attachedEnergy.size).toBe(0);
    expect(pokemon.status).toBe(POKEMON_NORMAL);
    expect(pokemon.isPoisoned).not.toBeTruthy();


});

test('toJson()', () => {

    const stageonecard = randomCard(CARD_POKEMON, POKEMON_STAGE_ONE);

    const pokemoncard = findBasicCard(stageonecard);


    const pokemon = new Pokemon(pokemoncard);


    pokemon.attachEnergy(randomCard(CARD_ENERGY));

    pokemon.evolve(stageonecard);

    pokemon.attachEnergy(randomCard(CARD_ENERGY));

    pokemon.attachItem(randomCard(CARD_TRAINER, TRAINER_ITEM, true));

    pokemon.hurt(10);

    pokemon.setStatus(POKEMON_ASLEEP);

    const obj = JSON.parse(pokemon.toJson());

    expect(obj.cardIds.length).toBe(5);

});

test('restore()', () => {


    const pokemon = Pokemon.restore({damage:10,status:POKEMON_ASLEEP,cardIds:[34,49,58,35,57,58],isPoisoned:false});


    expect(pokemon.status).toBe(POKEMON_ASLEEP);
    expect(pokemon.isPoisoned).not.toBeTruthy();
    expect(pokemon.category).toBe(POKEMON_STAGE_ONE);
    expect(pokemon._manifest.size).toBe(6);
    

});


test('restoreFromJson()',()=>{


    const json = JSON.stringify({damage:10,status:POKEMON_ASLEEP,cardIds:[19,49,58,57,58],isPoisoned:true});

    const pokemon = Pokemon.restoreFromJson(json);

    expect(pokemon.status).toBe(POKEMON_ASLEEP);
    expect(pokemon.isPoisoned).toBeTruthy();
    expect(pokemon.name).toBe('Helioptile');

})







