import CardStack from "../model/CardStack";
import {randomCard} from "../model/Card";
import range from 'lodash.range';


let deckCards;
let benchCards;
let deck;
let hand;
let bench;

beforeEach(() => {
    let Origin = {left: 150, top: 100};

    let CardWidth = 200;
    let Capacity = 1;
    let Margin = 5;
    let Size = 10;
    deckCards = range(Size).map(() => randomCard());

    deck = new CardStack({Origin, CardWidth, Capacity, Margin, Cards:deckCards});


    Origin = {left: 250, top: 150};

    CardWidth = 250;
    Capacity = 5;
    Margin = 5;
    Size = 3;
    benchCards = range(Size).map(() => randomCard());
    bench = new CardStack({Origin, CardWidth, Capacity, Margin, Cards:benchCards});

});


test('CardStack() initial a basic CardStack', () => {


    expect(deck.Offsets.size).toBe(10);
    expect(deck.Offsets.get(deckCards[0].instantKey)).toEqual({left: 155, top: 105, zIndex: 1});
    expect(deck.Offsets.get(deckCards[1].instantKey)).toEqual({left: 155, top: 105, zIndex: 2});
    expect(deck.Offsets.get(deckCards[9].instantKey)).toEqual({left: 155, top: 105, zIndex: 10});

});

test('addCard() test add cards function', () => {


    const newCard = randomCard();
    const key = newCard.instantKey;

    deck.addCard(key);
    expect(deck.Offsets.get(key)).toEqual({left: 155, top: 105, zIndex: 11});
    expect(deck.Offsets.size).toBe(11);

   // deck.removeCard(key);

});

test('addCard(key,index) test insert cards function', () => {


    const newCard = randomCard();
    const key = newCard.instantKey;

    deck.addCard(key,5);
    expect(deck.Offsets.get(key)).toEqual({left: 155, top: 105, zIndex: 5});
    expect(deck.Offsets.size).toBe(11);


});


test('removeCard() test remove cards function', () => {

    const newCard = randomCard();
    const key = newCard.instantKey;

    deck.addCard(key);
    expect(deck.Offsets.get(key)).toEqual({left: 155, top: 105, zIndex: 11});
    expect(deck.Offsets.size).toBe(11);


    deck.removeCard(deckCards[5].instantKey);
    expect(deck.Offsets.get(deckCards[4].instantKey)).toEqual({left: 155, top: 105, zIndex: 5});
    expect(deck.Offsets.get(deckCards[5].instantKey)).toBeUndefined();
    expect(deck.Offsets.get(deckCards[6].instantKey).zIndex).toBe(6);
    deck.removeCard(deckCards[1].instantKey);
    expect(deck.Offsets.size).toBe(9);


});


test('calculate() test calculate function', () => {


    expect(bench.Offsets.get(benchCards[0].instantKey)).toEqual({left: 255, top: 155, zIndex: 1});
    expect(bench.Offsets.get(benchCards[1].instantKey)).toEqual({left: 255 + 255, top: 155, zIndex: 2});

    let newCard = randomCard();
    const key1 = newCard.instantKey;

    bench.addCard(key1);
    expect(bench.Offsets.get(key1)).toEqual({left: 255 + 255*3, top: 155, zIndex: 4});

    newCard = randomCard();
    const key2 = newCard.instantKey;

    newCard = randomCard();
    const key3 = newCard.instantKey;

    bench.addCard(key2);
    bench.addCard(key3);
    expect(bench.Offsets.get(key2)).toEqual({left: 1071, top: 155, zIndex: 5});
    expect(bench.Offsets.get(key3)).toEqual({left: 1275, top: 155, zIndex: 6});
});

test('isInside() test isInside function', () => {


    expect(bench.isInside({x: 5, y: 5})).not.toBeTruthy();

    expect(bench.isInside({x: 255, y: 155})).toBeTruthy();

    expect(bench.isInside({x: 256, y: 156})).toBeTruthy();

    expect(bench.isInside({x: 300, y: 150})).not.toBeTruthy();

    expect(bench.isInside({x: 300, y: 500})).toBeTruthy();

    expect(bench.isInside({x: 300, y: 150 + 5 + 344})).toBeTruthy();

});


test('getCardIndex() test getCardIndex function', () => {

    let Origin = {left: 170, top: 90};

    let CardWidth = 150;
    let Capacity = 3;
    let Margin = 0;
    const bench = new CardStack({Origin, CardWidth, Capacity, Margin, Cards:benchCards});

    let newCard = randomCard();
    const key1 = newCard.instantKey;

    bench.addCard(key1);

    newCard = randomCard();
    const key2 = newCard.instantKey;
    bench.addCard(key2);

    console.log(bench.Offsets);
    expect(bench.getKeyOfMouseOverCard({x: 198, y: 195})).toBe(benchCards[0].instantKey);

    expect(bench.getKeyOfMouseOverCard({x: 266, y: 253})).toBe(benchCards[1].instantKey);
    expect(bench.getKeyOfMouseOverCard({x: 319, y: 222})).toBe(benchCards[1].instantKey);

    expect(bench.getKeyOfMouseOverCard({x: 320, y: 222})).toBe(benchCards[2].instantKey);
    expect(bench.getKeyOfMouseOverCard({x: 320, y: 296})).toBe(benchCards[2].instantKey);

    expect(bench.getKeyOfMouseOverCard({x: 394, y: 260})).toBe(benchCards[2].instantKey);
    expect(bench.getKeyOfMouseOverCard({x: 395, y: 260})).toBe(key1);

    expect(bench.getKeyOfMouseOverCard({x: 496, y: 260})).toBe(key2);

});


