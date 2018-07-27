import {Card, EnergyCard, PokemonCard, TrainerCard,randomCard,findBasicCard,CardTypeError} from "../model/Card";
import {
    CARD_ENERGY,
    CARD_POKEMON,
    ENERGY_COLORLESS, ENERGY_LIGHTNING,
    ENERGY_WATER,
    ENERGY_PSYCHIC,
    ENERGY_FIGHT,
    POKEMON_BASIC,
    POKEMON_STAGE_ONE,
    CARD_TRAINER, TRAINER_ITEM, TRAINER_SUPPORTER, ENERGY_DARKNESS
} from "../constants";
import Pokemon from "../model/Pokemon";



test('randomCard() get random cards from specific type and category', ()=> {

    const anyCard= randomCard();

    expect(anyCard).toBeInstanceOf(Card);


    const pokemonCard= randomCard(CARD_POKEMON);

    expect(pokemonCard).toBeInstanceOf(PokemonCard);
    

    const basic_pokemonCard= randomCard(CARD_POKEMON,POKEMON_BASIC);

    expect(basic_pokemonCard).toBeInstanceOf(PokemonCard);
    expect(basic_pokemonCard.category).toBe(POKEMON_BASIC);

    const satege_one_pokemonCard= randomCard(CARD_POKEMON,POKEMON_STAGE_ONE);

    expect(satege_one_pokemonCard).toBeInstanceOf(PokemonCard);
    expect(satege_one_pokemonCard.category).toBe(POKEMON_STAGE_ONE);

    const SUPPORTER_pokemonCard= randomCard(CARD_TRAINER,TRAINER_SUPPORTER);

    expect(SUPPORTER_pokemonCard).toBeInstanceOf(TrainerCard);
    expect(SUPPORTER_pokemonCard.category).toBe(TRAINER_SUPPORTER);

    const item_pokemonCard= randomCard(CARD_TRAINER,TRAINER_ITEM);

    expect(item_pokemonCard).toBeInstanceOf(TrainerCard);
    expect(item_pokemonCard.category).toBe(TRAINER_ITEM);

    const attachable_item_pokemonCard= randomCard(CARD_TRAINER,TRAINER_ITEM,true);

    expect(attachable_item_pokemonCard).toBeInstanceOf(TrainerCard);
    expect(attachable_item_pokemonCard.category).toBe(TRAINER_ITEM);
    expect(attachable_item_pokemonCard.attachable).toBeTruthy();

    const colorless_energyCard= randomCard(CARD_ENERGY,ENERGY_COLORLESS);

    expect(colorless_energyCard).toBeInstanceOf(EnergyCard);

    const water_energyCard= randomCard(CARD_ENERGY,ENERGY_WATER);

    expect(water_energyCard).toBeInstanceOf(EnergyCard);
    expect(water_energyCard.category).toBe(ENERGY_WATER);


    const lightning_energyCard= randomCard(CARD_ENERGY,ENERGY_LIGHTNING);

    expect(lightning_energyCard).toBeInstanceOf(EnergyCard);
    expect(lightning_energyCard.category).toBe(ENERGY_LIGHTNING);

    const psychic_energyCard= randomCard(CARD_ENERGY,ENERGY_PSYCHIC);

    expect(psychic_energyCard).toBeInstanceOf(EnergyCard);
    expect(psychic_energyCard.category).toBe(ENERGY_PSYCHIC);


    const fight_energyCard= randomCard(CARD_ENERGY,ENERGY_FIGHT);

    expect(fight_energyCard).toBeInstanceOf(EnergyCard);
    expect(fight_energyCard.category).toBe(ENERGY_FIGHT);

    const t = () => {
        randomCard(CARD_ENERGY,ENERGY_DARKNESS);
    };

    expect(t).toThrow(CardTypeError);

});

test('get a PokemonCard instant', ()=> {

    const card= Card.getCardInstants(1);

    expect(card).toBeInstanceOf(PokemonCard);

});

test('get a stage-one PokemonCard instant', ()=> {

    const card= Card.getCardInstants(4);

    expect(card).toBeInstanceOf(PokemonCard);
    expect(card.category).toBe(POKEMON_STAGE_ONE);

});

test('get a TrainerCard instant', ()=> {

    const card= Card.getCardInstants(49);

    expect(card).toBeInstanceOf(TrainerCard);

});

test('get a EnergyCard instant', ()=> {

    const card= Card.getCardInstants(57);

    expect(card).toBeInstanceOf(EnergyCard);

});

test('findBasicCard(stageone) by stageone pokemoncard', ()=> {

    const stageonecard =  randomCard(CARD_POKEMON,POKEMON_STAGE_ONE);

    const basicCard= findBasicCard(stageonecard);

    expect(stageonecard.from).toBe(basicCard.name);

});


