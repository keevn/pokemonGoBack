import CardStack from "../model/CardStack";
import {randomCard} from "../model/Card";
import range from 'lodash.range';
import {DIRECTION_FROM_BOTTOM, DIRECTION_FROM_TOP} from "../constants";


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
    let Size = 60;
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


    expect(deck.Cards.size).toBe(10);
    expect(deck.Cards.get(0)).toEqual({left: 155, top: 105, zIndex: 1});
    expect(deck.Cards.get(1)).toEqual({left: 155, top: 105, zIndex: 2});
    expect(deck.Cards.get(9)).toEqual({left: 155, top: 105, zIndex: 10});

});

test('addCard() test add cards function', () => {


    const newCard = randomCard();
    deckCards.push(newCard);
    const key = deckCards.indexOf(newCard);

    deck.addCard(key);
    expect(deck.Cards.get(key)).toEqual({left: 155, top: 105, zIndex: 11});
    expect(deck.Cards.size).toBe(11);

   // deck.removeCard(key);

});

test('addCard(key,index) test insert cards function', () => {


    const newCard = randomCard();
    deckCards.push(newCard);
    const key = deckCards.indexOf(newCard);

    deck.addCard(key,5);
    expect(deck.Cards.get(key)).toEqual({left: 155, top: 105, zIndex: 5});
    expect(deck.Cards.size).toBe(11);


});


test('removeCard() test remove cards function', () => {

    const newCard = randomCard();
    deckCards.push(newCard);
    const key = deckCards.indexOf(newCard);

    deck.addCard(key);
    expect(deck.Cards.get(key)).toEqual({left: 155, top: 105, zIndex: 11});
    expect(deck.Cards.size).toBe(11);


    deck.removeCard(5);
    expect(deck.Cards.get(4)).toEqual({left: 155, top: 105, zIndex: 5});
    expect(deck.Cards.get(5)).toBeUndefined();
    expect(deck.Cards.get(6).zIndex).toBe(6);
    deck.removeCard(1);
    expect(deck.Cards.size).toBe(9);


});


test('calculate() test calculate function', () => {


    expect(bench.Cards.get(0)).toEqual({left: 255, top: 155, zIndex: 1});
    expect(bench.Cards.get(1)).toEqual({left: 255 + 255, top: 155, zIndex: 2});

    let newCard = randomCard();
    benchCards.push(newCard);
    const key1 = benchCards.indexOf(newCard);

    bench.addCard(key1);
    expect(bench.Cards.get(key1)).toEqual({left: 255 + 255*3, top: 155, zIndex: 4});

    newCard = randomCard();

    benchCards.push(newCard);
    const key2 = benchCards.indexOf(newCard);

    newCard = randomCard();

    benchCards.push(newCard);
    const key3 = benchCards.indexOf(newCard);

    bench.addCard(key2);
    bench.addCard(key3);
    expect(bench.Cards.get(key2)).toEqual({left: 1071, top: 155, zIndex: 5});
    expect(bench.Cards.get(key3)).toEqual({left: 1275, top: 155, zIndex: 6});
});

test('isInside() test isInside function', () => {


    expect(bench.isInside({x: 5, y: 5})).not.toBeTruthy();

    expect(bench.isInside({x: 255, y: 155})).toBeTruthy();

    expect(bench.isInside({x: 256, y: 156})).toBeTruthy();

    expect(bench.isInside({x: 300, y: 150})).not.toBeTruthy();

    expect(bench.isInside({x: 300, y: 500})).toBeTruthy();

    expect(bench.isInside({x: 300, y: 150 + 5 + 344})).toBeTruthy();

});

test('shuffle() test shuffle card stack function', () => {

    const order = [];

    for (let key of deck.Cards.keys()) {

        order.push(deck.Cards.get(key).zIndex);
    }


    deck.shuffle();

    const newOrder = [];

    for (let key of deck.Cards.keys()) {

        newOrder.push(deck.Cards.get(key).zIndex);
    }

    expect(order).not.toEqual(newOrder);



});


test('popCardIds() test pop n card ids out from the top or bottom of the stack', () => {


    let id = deck.popCardIds(1,DIRECTION_FROM_TOP);

    expect(id).toEqual([9]);

     id = deck.popCardIds(1,DIRECTION_FROM_BOTTOM);

    expect(id).toEqual([0]);

    let ids= deck.popCardIds(2);

    expect(ids).toEqual([9,8]);

    ids= deck.popCardIds(2,DIRECTION_FROM_BOTTOM);

    expect(ids).toEqual([0,1]);

    deck.shuffle();

    ids= deck.popCardIds(5);

    console.log(deck,ids);

});




test('getCardIndex() test getCardIndex function', () => {

    let Origin = {left: 170, top: 90};

    let CardWidth = 150;
    let Capacity = 3;
    let Margin = 0;
    const bench = new CardStack({Origin, CardWidth, Capacity, Margin, Cards:benchCards});

    let newCard = randomCard();
    benchCards.push(newCard);
    const key1 = benchCards.indexOf(newCard);
    bench.addCard(key1);

    newCard = randomCard();

    benchCards.push(newCard);
    const key2 = benchCards.indexOf(newCard);
    bench.addCard(key2);

    console.log(bench.Cards);
    expect(bench.getKeyOfMouseOverCard({x: 198, y: 195})).toBe(0);

    expect(bench.getKeyOfMouseOverCard({x: 266, y: 253})).toBe(1);
    expect(bench.getKeyOfMouseOverCard({x: 319, y: 222})).toBe(1);

    expect(bench.getKeyOfMouseOverCard({x: 320, y: 222})).toBe(2);
    expect(bench.getKeyOfMouseOverCard({x: 320, y: 296})).toBe(2);

    expect(bench.getKeyOfMouseOverCard({x: 394, y: 260})).toBe(2);
    expect(bench.getKeyOfMouseOverCard({x: 395, y: 260})).toBe(key1);

    expect(bench.getKeyOfMouseOverCard({x: 496, y: 260})).toBe(key2);

});


