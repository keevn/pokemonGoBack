import deck from '../../util/container';

test('decktest() ', ()=> {

    const deck1 = new deck();

    const x= deck1.decktest();



    expect(x).toBe(200);

});