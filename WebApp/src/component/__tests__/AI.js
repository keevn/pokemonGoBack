import Pokemon from "../model/Pokemon";
import {CARD_POKEMON, POKEMON_BASIC} from "../constants";
import {randomCard} from "../model/Card";
import AI from '../../AI/AI';
import range from "lodash.range";
import CardStack from "../model/CardStack";


let cards;
let hand;

beforeEach(() => {
    let Origin = {left: 150, top: 100};

    let CardWidth = 200;
    let Capacity = 7;
    let Margin = 5;
    let Size = 20;
    cards = [...range(5).map(() => randomCard(CARD_POKEMON, POKEMON_BASIC)),...range(15).map(() => randomCard())];


    hand = new CardStack({Origin, CardWidth, Capacity, Margin, Cards:cards});


});

test('pickActiveFromHand()', ()=> {



     const cardIndex =  AI.pickActiveFromHand(hand,cards);

     console.log(cardIndex);

    expect(cards[cardIndex].category).toBe(POKEMON_BASIC);

});