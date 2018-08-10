import {PokemonCard} from "../component/model/Card";
import {POKEMON_BASIC} from "../component/constants";
import random from "lodash.random";
import {message} from "antd";
import Pokemon from "../component/model/Pokemon";
import Ability from "./Ability";

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

    static pickPokemonFromBench(bench, cards) {

        const pokemonIndex = [];
        for (let key of bench.Cards.keys()) {

            if (cards[key] instanceof Pokemon) {
                pokemonIndex.push(key);
            }

        }

        const randomIndex = random(0, pokemonIndex.length - 1);

        return pokemonIndex[randomIndex];
    }

    static playTurn(ai, player, game) {


        const doRandomMoves = () => {

            const moveList = [
                AI.attachEnergy,
                AI.attachEnergy,
                AI.attachEnergy,
                AI.attachEnergy,
                AI.attachEnergy,
                AI.attachEnergy,
                AI.placePokemon,
                AI.useItem,
                AI.useSupporter,
                //AI.retreatPokemon,
                AI.evolvePokemon,
                AI.attack,
                AI.attack,
                AI.attack,
                AI.attack,
                AI.endTurn
            ];

            return new Promise((resolve) => {

                const n = moveList.length - 1;
                const randomMove = moveList[random(0, n)];


                if (!ai.attacked && !ai.turnWillFinish) {
                    randomMove(ai, player, game).then(resolve);
                } else (
                    resolve()
                );

            });
        };


        return new Promise((resolve) => {

            AI.drawCard(ai, game)                //make sure each turn draw a card from the deck first
                .then(doRandomMoves)
                .then(resolve);

        });

    }


    static drawCard = (ai, game) => {
        return new Promise((resolve, reject) => {

            if (!ai.cardDrawn) {                                       //only draw once


                ai.cardDrawn = true;

                if (ai.deck.Cards.size === 0) {                       //no card to draw,set a sign
                    ai.noCardtoDraw = true;

                    resolve();

                } else {

                    console.log("AI drawn a card.");
                    ai.draw();
                    game.forceUpdate();

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

                resolve();

            } else {

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
                        resolve();
                    }, 500);
                } else {
                    resolve();
                }
            }

        });
    };

    static attachEnergy = (ai, player, game) => {
        return new Promise((resolve, reject) => {
            if (!ai.energized && ai.hasEnergyInHnad()) {
                console.log("AI attach a energy");

                const active = ai.getActivePokemon();

                if (active && active.attachedEnergy.size < 4) {


                    ai.attachToPokemon(active, ai.getEnergyCardKey());

                } else {

                    const pokemon = ai.getRandomPokemonFromBench();

                    if (pokemon) ai.attachToPokemon(pokemon, ai.getEnergyCardKey());

                }


                ai.energized = true;

                game.forceUpdate();

                setTimeout(() => {

                    resolve();
                }, 500);


            } else {
                resolve();
            }


        });
    };

    static useItem = (ai, player, game) => {
        return new Promise((resolve, reject) => {

            if (ai.hasItemCardInHand()) {

                console.log("AI attach a item to pokemon");

                const active = ai.getActivePokemon();

                const itemCardKey = ai.getItemCardKey();
                const itemCard = ai.cards[itemCardKey];

                if (itemCard.attachable) {

                    if (active && !active.attachedItem) {

                        ai.attachToPokemon(active, ai.getItemCardKey());

                    } else {

                        const pokemon = ai.getRandomPokemonFromBench();

                        if (pokemon) ai.attachToPokemon(pokemon, ai.getItemCardKey());

                    }

                    setTimeout(() => {
                        resolve();
                    }, 500);

                } else {

                    ai.moveCard(ai.hand, ai.pitStop, itemCardKey);
                    game.forceUpdate();

                    setTimeout(() => {
                        console.log("use item card ability");
                        ai.moveCard(ai.pitStop, ai.discard, itemCardKey);
                        game.forceUpdate();

                        setTimeout(() => {
                            resolve();
                        }, 500);

                    }, 1000);
                }


            } else {
                resolve();
            }

        });
    };

    static useSupporter = (ai, player, game) => {
        return new Promise((resolve, reject) => {
            if (!ai.supported) {

                if (ai.hasSupportedCardInHand()) {

                    console.log("AI used a support card.");

                    const supporterCardKey = ai.getSupporterCardKey();
                    ai.moveCard(ai.hand, ai.pitStop, supporterCardKey);
                    game.forceUpdate();

                    setTimeout(() => {
                        console.log("user supporter card ability");
                        ai.moveCard(ai.pitStop, ai.discard, supporterCardKey);
                        game.forceUpdate();

                        setTimeout(() => {
                            resolve();
                        }, 500);

                    }, 1000);

                    ai.supported = true;

                } else {
                    resolve();
                }

            } else {
                resolve();
            }

        });
    };

    static retreatPokemon = (ai, player, game) => {

        return new Promise((resolve) => {
            if (ai.retreatableInTurn()) {

                const active = ai.getActivePokemon();

                if (active && active.isRetreatable()) {

                    console.log("AI retreated active pokemon");

                    //move the active pokemon to the pitstop

                    ai.moveCard(ai.active, ai.pitStop, active.cardIndex);

                    game.forceUpdate();

                    const detachedCards = active.retreat();

                    for (const card of detachedCards) {

                        ai.pitStop.addCard(card.cardIndex);
                        card.stack = ai.pitStop;
                        card.zIndex = active.zIndex - 1;

                    }

                    let i = 1;
                    for (const card of detachedCards) {                 //detached the energy used for retreating

                        setTimeout(() => {

                            ai.moveCard(ai.pitStop, ai.discard, card.cardIndex);

                            game.forceUpdate();

                        }, (i + 1) * 500);

                        i++;
                    }

                    //pick a new active pokemon
                    setTimeout(() => {

                        const cardIndex = AI.pickPokemonFromBench(ai.bench, ai.cards);

                        console.log(ai.name, "move one pokemon to Active");

                        ai.moveCard(ai.bench, ai.active, cardIndex);

                        game.forceUpdate();
                        ai.pokemonlize();

                    }, (i + 1) * 500);


                    setTimeout(() => {                                  //move the retreated pokemon to the bench
                        console.log(ai.name, "move retreated pokemon back to bench");

                        ai.moveCard(ai.pitStop, ai.bench, active.cardIndex);

                        game.forceUpdate();

                        resolve();

                    }, (i + 2) * 500);


                    ai.retreated = true;

                } else {
                    resolve();
                }

            } else {
                resolve();
            }


        });
    };

    static evolvePokemon = (ai, player, game) => {
        return new Promise((resolve, reject) => {
            if (ai.firstRound) {

                resolve();

            } else {
                console.log("AI evolved a pokemon");

                const stageOnePokemons = ai.getStageOnePokemonListFromHand();
                const basicPokemons = ai.getAllBasicPokemonFromField();

                let evolved = false;

                for (const stageOnePokemon of stageOnePokemons) {

                    for (const basicPokemon of basicPokemons) {

                        if (basicPokemon.evolvableFrom(stageOnePokemon)) {

                            evolved = ai.attachToPokemon(basicPokemon, stageOnePokemon.cardIndex);

                            if (evolved) break;
                        }
                    }

                    if (evolved) break;
                }

                if (evolved) {

                    game.forceUpdate();

                    setTimeout(() => {

                        resolve();

                    }, 500);

                } else {

                    resolve();
                }

            }

        });
    };

    static attack = (ai, player, game) => {
        return new Promise((resolve) => {
            if (ai.attackableInTurn()) {
                const active = ai.getActivePokemon();

                if (active.isAttackable()){
                    const abilities = active.getAvailableSills();

                    if (abilities.length>0){
                        console.log("AI use an attack.");




                        const skill = abilities[random(0,abilities.length-1)];

                        const a = new Ability(skill.skill.id,ai);


                        message.success(`${ai.name} just used ${skill.skill.name} attacked you!`);

                        a.promiseSerial().then((result) => {
                            console.log(result);
                            game.forceUpdate();
                            ai.attacked = true;
                            resolve();
                        });


                    } else {
                        resolve();
                    }
                }else {
                    resolve();
                }
            } else {

                resolve();
            }

        });
    };

    static endTurn = (ai, player, game) => {
        return new Promise((resolve) => {
            if (!ai.turnWillFinish) {
                console.log("AI finish its turn.");

                ai.turnWillFinish = true;
            }
            resolve();

        });
    }


}