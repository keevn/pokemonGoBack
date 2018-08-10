import {randomCard} from "../component/model/Card";
import {CARD_POKEMON, POKEMON_BASIC} from "../component/constants";


self.addEventListener('message', event => {
    console.log('AI start to work');

    const card =randomCard(CARD_POKEMON,POKEMON_BASIC);
    console.log(card.name);

    this.player1cards =JSON.parse(event.data[1]);
    this.player2cards =JSON.parse(event.data[0]);

   

    console.log(this.player1cards[1].stack);


    self.postMessage({cmd:'move',from:'deck',to:'hand',cardIndex:1});

});

