import {PokemonCard} from "../component/model/Card";
import {POKEMON_BASIC} from "../component/constants";
import random from "lodash.random";
import {message} from "antd";

export default class AI {

    static pickPokemonFromHand(hand, cards) {

        const basicPokemonIndex = [];
        for (let key of hand.Cards.keys()) {

            if (cards[key] instanceof PokemonCard && cards[key].category === POKEMON_BASIC) {
                basicPokemonIndex.push(key);
            }

        }

        const randomIndex = random(0, basicPokemonIndex.length - 1);

        return basicPokemonIndex[randomIndex];
    }

    static playTurn(ai, player, game) {

        const toDoList = [AI.attachEnergy,
            AI.placePokemon,
            AI.attachItem,
            AI.useSupporter,
            AI.retreatPokemon,
            AI.evolvePokemon,
            AI.attack,
            AI.endTurn];


        const doRandomMoves = () => {
            return new Promise((resolve) => {

                const n=toDoList.length - 1;
                const firstMove = toDoList[random(0, n)];

                firstMove(ai, player, game).then(() => {
                    if (!ai.attacked && !ai.turnWillFinish) {
                        return toDoList[random(0, n)];
                    }
                });

                resolve();
            });
        };


        return new Promise((resolve) => {

            AI.drawCard(ai, game)
                .then(doRandomMoves)
                .then(resolve)
                .catch(()=>{
                    console.log("only here once");
                });

        });

    }


    static drawCard = (ai, game) => {
        return new Promise((resolve, reject) => {

            if (!ai.cardDrawn){
                
                if (ai.deck.Cards.size === 0) {
                    ai.noCardtoDraw = true;


                    ai.cardDrawn = true;
                    resolve();

                } else {

                    console.log("AI drawn a card.");
                    ai.draw();
                    game.forceUpdate();

                    ai.cardDrawn = true;
                    setTimeout(resolve, 500);
                }

            } else {
                resolve();
            }


        });
    };


    static placePokemon = (ai, player, game) => {

        return new Promise((resolve, reject) => {

            console.log("AI placePokemon to then bench.");
            if (ai.bench.Cards.size === ai.bench.Capacity) {

                console.log("bench is full.");
                
                resolve(ai, player, game);

            }   else {

                let i = 0;

                while (true) {

                    if (ai.hasBasicPokemonInHand() && random(0, 1)) {

                        const cardIndex = AI.pickPokemonFromHand(ai.hand, ai.cards);

                        ai.moveCard(ai.hand, ai.bench, cardIndex);

                        game.forceUpdate();

                        i++;

                    } else {
                        break;
                    }
                }

                if (i) {
                    setTimeout(() => {
                        ai.pokemonlize();
                    }, 500);
                    setTimeout(() => {
                        message.info(`${ai.name} move ${i} basic pokemon${i > 1 ? "s" : ""} to Bench`);
                        console.log(ai.name, "move basic pokemon to Bench", i);
                        resolve(ai, player, game);
                    }, 500);
                }
            }

        });
    };

    static attachEnergy = (ai, player, game) => {
        return new Promise((resolve, reject) => {
            if (!ai.energized && ai.hasEnergyInHnad()) {
                console.log("AI attach a energy");
                
                const active =  ai.getActivePokemon();

                if (active && active.attachedEnergy.size<4) {
                    ai.attachToPokemon(active,ai.getEnergyCardKey());

                } else {

                    const pokemon = ai.getRandomPokemonFromBench();

                    if (pokemon) ai.attachToPokemon(pokemon,ai.getEnergyCardKey());

                }

                game.forceUpdate();


                ai.energized = true;
            }

            resolve(ai, player, game);
        });
    };

    static attachItem = (ai, player, game) => {
        return new Promise((resolve, reject) => {

            console.log("AI attach a item to pokemon");

            resolve(ai, player, game);

        });
    };

    static useSupporter = (ai, player, game) => {
        return new Promise((resolve, reject) => {
            if (!ai.supported) {
                console.log("AI used a support card.");

                ai.supported = true;
            }
            resolve(ai, player, game);
        });
    };

    static retreatPokemon = (ai, player, game) => {

        return new Promise((resolve, reject) => {
            if (!ai.retreated) {

                console.log("AI retreated active pokemon");

                ai.retreated = true;
            }

            resolve(ai, player, game);
        });
    } ;

    static evolvePokemon = (ai, player, game) => {
        return new Promise((resolve, reject) => {

            console.log("AI evolved a pokemon");

            resolve(ai, player, game);
        });
    } ;

    static attack = (ai, player, game) => {
        return new Promise((resolve, reject) => {
        if (!ai.attacked) {

            console.log("AI user an attack.");

            ai.attacked = true;
        }

        resolve(ai,player,game);
        });
    };

    static endTurn = (ai, player, game) => {
            return new Promise((resolve, reject) => {
        if (!ai.turnWillFinish) {
            console.log("AI finish its turn.");

            ai.turnWillFinish = true;
        }


        resolve(ai,player,game);
            });
    }


}