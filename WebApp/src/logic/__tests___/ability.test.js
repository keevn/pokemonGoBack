import Ability from "../Ability";


let a;

beforeEach(() => {

    a = new Ability(16);

});

test('promiseSerial()', ()=> {

    a.promiseSerial().then((result) => {
        console.log(result);
    });

});