import React from 'react';
import {
    MULLIGAN,
    GAME_FINISH,
    GAME_STAGE_SETTING_UP,
    GAME_STAGE_INIT_PRIZE,
    GAME_STAGE_INIT_ACTIVE,
    GAME_STAGE_INIT_BENCH,
    GAME_STAGE_REGULAR_TURN,
    GAME_STAGE_ANNOUNCE_WINNER,
    POKEMON_BASIC,
    GLOW_POKEMON_IN_HAND, TRAINER_SUPPORTER, NO_TURN_END
} from "../component/constants";
import range from "lodash.range";
import random from 'lodash.random';
import {shuffle} from "../util/Helpers";
import Player from '../component/model/Player';
import {Modal, Button, message, Affix} from 'antd';
import {FlipCoin, DeckSelector} from "../util/Helpers";
import Pokemon from "../component/model/Pokemon";
import PokemonView from "../component/PokemonView";
import CardView from "../component/CardView";
import Active from "../component/Active";
import {PokemonCard, TrainerCard} from "../component/model/Card";
import Deck from "../component/Deck";
import Discard from "../component/Discard";
import Bench from "../component/Bench";
import Hand from "../component/Hand";
import Prize from "../component/Prize";
import PitStop from "../component/PitStop";
import CoinPic from "../component/CoinPic";
import AI from "../AI/AI";

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.GameBoard = React.createRef();

        this.user = props.currentUser;

        this.gameStage = GAME_STAGE_SETTING_UP;
        this.deckLoaded = false;
        this.firstRound = true;
        this.inGameLoopControl = false;
        this.inTurnChecking = false;

        this.currentPlayer = null;
        this.winner = null;

        this.gameLoopFuncStack = [];

        this.state = {
            interval: 1000,
            isRunning: false,

            isPressed: false,
            selectedIndex: null,
            dragTarget: null,
        };

    }


    loadDecks = () => {

        this.inGameLoopControl = true;
        return new Promise((resolve) => {
            DeckSelector(this.user, resolve);
        });
    };

    initialPlayers = (decksInfo) => {

        const component = this;

        this.player = Player.getPlayer(this.props.currentUser, decksInfo[0], decksInfo[2]);
        this.AI = Player.getAIPlayer({name: "AI", id: 1}, decksInfo[1], decksInfo[3]);

        this.player.opponent = this.AI;
        this.AI.opponent = this.player;
        this.player.component = component;
        this.AI.component = component;
        this.player.initialDeck();
        this.AI.initialDeck();
        this.deckLoaded = true;

        this.forceUpdate();

    };

    pickFirstPlayer = () => {
        return new Promise((resolve) => {
            FlipCoin(1, "If it‘s a Head, the player goes first", resolve);
        });
    };

    finishSettingUp = (flipResult) => {

        const winner = flipResult.head ? this.player : this.AI;

        //console.log("Decide the who goes the first:", winner.name);
        message.success(`${winner.name} go first!`);

        winner.isFirstHandPlayer = true;
        this.firstHandPlayer = winner;
        this.currentPlayer = winner;
        this.currentInOperating = winner;
        this.currentPlayer.resetTurn(true);       //true means the first turn
        this.currentPlayer.opponent.resetTurn(true);

        this.gameStage = GAME_STAGE_INIT_ACTIVE;
        this.inGameLoopControl = false;              //let system take over
    };

    prepareFirstHand = () => {

        return new Promise((resolve, reject) => {

            const afterDraw = () => {

                console.log(this.currentPlayer.name, " draw 7 cards");


                const hasBasicPokemon = random(0, 10) > 3;//this.currentPlayer.hasBasicPokemonInHand();
                console.log(this.currentPlayer.name, "has basic Pokemon:", hasBasicPokemon);

                if (hasBasicPokemon) resolve();
                else reject(new Error(MULLIGAN));

            };

            setTimeout(() => {

                range(7).map(i => {
                    setTimeout(() => {
                        this.currentPlayer.draw();
                        this.forceUpdate();
                    }, i * 500);

                });

                setTimeout(afterDraw, 8 * 500);

            }, 500);


        });

    };

    setActivePokemon = () => {

        return new Promise((resolve) => {

            if (this.currentPlayer === this.AI) {    //AI move


                const cardIndex = AI.pickPokemonFromHand(this.AI.hand, this.AI.cards);

                let card = this.AI.cards[cardIndex];

                this.AI.moveCard(this.AI.hand, this.AI.active, cardIndex);

                this.forceUpdate();


                setTimeout(() => {
                    console.log(this.AI.name, "move one basic pokemon to Active");
                    resolve();
                }, 500);

            } else {    //wait for the user to pick the active pokemon  ,
                        //Usually the game flow does two things here :
                        // 1. determine the condition, and
                        // 2. notify the user do a move periodically,
                        //    and make sure the periodic process will end in certain conditions

                if (!this.currentPlayer.hasActivePokemon()) {

                    message.warning("Place choose your active Pokemon!");

                    this.player.glowCards(GLOW_POKEMON_IN_HAND);
                    this.forceUpdate();

                    //save up the callback,then jump out the loop ,give the control to player
                    this.gameLoopFuncStack.push(resolve);

                }

                this.activePokemonTimer = window.setInterval(() => {

                    if (!this.currentPlayer.hasActivePokemon()) {

                        message.warning("Place choose your active Pokemon!");

                    } else {

                        this.player.resetGlowness();
                        this.forceUpdate();

                        if (this.activePokemonTimer) {
                            window.clearTimeout(this.activePokemonTimer);
                            this.activePokemonTimer = null;

                        }

                    }

                }, 10000);

            }


        });
    };

    finishInitActivePokemon = () => {
        this.inGameLoopControl = false;
    };

    mulliganOccurred = (error) => {

        console.log(error);

        if (MULLIGAN!==error.message)   {              //only deal with mulligan
            this.inGameLoopControl = false;
            return;
        }

        this.currentPlayer.mulligan++;
        console.log(this.currentPlayer.name, "has a mulligan! total mulligan:", this.currentPlayer.mulligan);


        message.success(`${this.currentPlayer.name} has ${this.currentPlayer.mulligan} mulligan${this.currentPlayer.mulligan > 1 ? "s" : ""}!`);


        const hand = this.currentPlayer.hand;
        const deck = this.currentPlayer.deck;

        let delay = 0;

        if (this.currentPlayer === this.AI) {
            hand.face_down = false;
            delay = 2500;

            this.forceUpdate();

        }

        setTimeout(() => {

            for (let key of hand.Cards.keys()) {

                this.currentPlayer.moveCard(hand, deck, key);

            }

            this.forceUpdate();

        }, delay);


        setTimeout(() => {

            deck.shuffle();


            if (this.currentPlayer === this.AI) {
                hand.face_down = true;

                this.forceUpdate();

            }

            this.inGameLoopControl = false;                 //mulligan process finished, give the control back to game loop

        }, 500 + delay);

    };

    processMulligan = () => {

        return new Promise((resolve) => {


            if (this.player.mulligan > this.AI.mulligan) {   //the player has more mulligan , AI draw more cards

                const n = this.player.mulligan - this.AI.mulligan;

                message.success(`AI choose to draw extra ${n} card${n > 1 ? "s" : ""}!`);

                setTimeout(() => {

                    range(n).map(i => {
                        setTimeout(() => {
                            this.AI.draw();
                            this.forceUpdate();
                        }, i * 500);

                    });

                    setTimeout(resolve, (n + 1) * 500);

                }, 500);

            } else { //AI has more mulligan , the player draw more cards

                const n = this.AI.mulligan - this.player.mulligan;
                if (n === 0) resolve();
                else {
                    Modal.confirm({
                        title: 'Extra Card to draw.',
                        content: `AI has extra ${n} mulligan${n > 1 ? "s" : ""}, Do you wanna draw ${n} extra card${n > 1 ? "s" : ""}?`,
                        onOk: () => {
                            setTimeout(() => {

                                range(n).map(i => {
                                    setTimeout(() => {
                                        this.player.draw();
                                        this.forceUpdate();
                                    }, i * 500);

                                });

                                setTimeout(resolve, (n + 1) * 500);

                            }, 500);
                        },
                        onCancel: () => {
                            resolve();
                        },
                    });
                }
            }

        });

    };

    drawPrizeCard = () => {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                range(6).map(i => {
                    setTimeout(() => {
                        this.player.draw(this.player.prize);
                        this.forceUpdate();
                    }, i * 300);

                });
            }, 500);

            setTimeout(() => {
                range(6).map(i => {
                    setTimeout(() => {
                        this.AI.draw(this.AI.prize);
                        this.forceUpdate();
                    }, i * 300);

                });

                setTimeout(resolve, 8 * 300);

            }, 500);
        });
    };

    finishDrawPrize = () => {

        console.log("Both draw 6 cards to Prize");
        this.gameStage = GAME_STAGE_INIT_BENCH;
        this.inGameLoopControl = false;

    }

    prepareBench = () => {
        return new Promise((resolve) => {

            if (this.currentPlayer === this.AI) {    //AI move

                let i = 0;

                while (true) {

                    if (this.AI.hasBasicPokemonInHand() && random(0, 1)) {

                        const cardIndex = AI.pickPokemonFromHand(this.AI.hand, this.AI.cards);

                        this.AI.moveCard(this.AI.hand, this.AI.bench, cardIndex);

                        this.forceUpdate();

                        i++;

                    } else {
                        break;
                    }
                }

                setTimeout(() => {
                    message.info(`${this.AI.name} move ${i} basic pokemon${i > 1 ? "s" : ""} to Bench`);
                    console.log(this.AI.name, "move basic pokemon to Bench", i);
                    resolve();
                }, i? 500:0);


            } else {           //wait for the user to place pokemon to bench

                if (this.player.hasBasicPokemonInHand()) {

                    message.warning("Place your Pokemon to your Bench!");

                    this.player.glowCards(GLOW_POKEMON_IN_HAND);
                    this.forceUpdate();


                    let timeOut = 5;

                    this.benchPokemonTimer = window.setInterval(() => {

                        if (this.player.hasBasicPokemonInHand() && timeOut) {

                            //this.player.glowCards(GLOW_POKEMON_IN_HAND);
                            //this.forceUpdate();

                            timeOut--;

                            if (timeOut) message.warning("Place your Pokemon to your Bench!");
                            else message.warning("Timeout, move on!");

                        } else {

                            if (this.benchPokemonTimer) {
                                window.clearTimeout(this.benchPokemonTimer);
                                this.benchPokemonTimer = null;

                            }
                            this.player.resetGlowness();
                            this.forceUpdate();

                            resolve();
                        }

                    }, 5000);

                } else {
                    this.player.resetGlowness();
                    this.forceUpdate();

                    resolve();     //no basic pokemon in hand,move on

                }

            }

        });

    };

    finishInitBench = () => {

        this.currentPlayer.isBenchReady = true;
        this.inGameLoopControl = false;

    };

    showPokemonOnBench = () => {
        return new Promise((resolve) => {

            this.AI.pokemonlize();
            this.AI.bench.face_down = false;
            this.AI.active.face_down = false;

            this.forceUpdate();


            this.player.pokemonlize();

            setTimeout(() => {

                this.gameStage = GAME_STAGE_REGULAR_TURN;
                resolve();
            }, 1000);

        });

    };

    switchPlayer = () => {
        this.currentPlayer = this.currentPlayer.opponent;
        this.forceUpdate();
        message.warning(`${this.currentPlayer.name}'s turn!`);
    };

    winnerCheck= ()=>{    //check whether there is a winner ,if so return winner player, otherwise return null

        console.log("check winner....");
        this.inGameLoopControl = true;
       /* 1.who took his/her six prize cards
        2.whose opponent has no Active Pokémon nor Bench Pokémon
        3.whose opponent cannot draw a card from their Deck at the beginning of their turn.*/

       return new Promise ((resolve)=>{

           if (this.gameStage===GAME_STAGE_REGULAR_TURN) resolve(null);   //only check in regular turns

           if (this.currentPlayer.prize.Cards.size===0)
               resolve(this.currentPlayer);

           else if (!this.currentPlayer.hasActivePokemon() && !this.currentPlayer.hasPokemonInHand())
               resolve(this.currentPlayer.opponent);

           else if (this.currentPlayer.noCardtoDraw)
               resolve(this.currentPlayer.opponent);

           else resolve(null);
       });

    };

    afterWinnerCheck = (winner)=>{
        return new Promise ((resolve,reject)=>{
            
            if (winner) {

                this.winner = winner;
                this.gameStage = GAME_STAGE_ANNOUNCE_WINNER;

                this.inGameLoopControl = false;
                reject(new Error(GAME_FINISH));               //not a real error, use this to control the game flow
                
            }else resolve();


        });
    }

    turnEndingCheck = ()=>{
        return new Promise ((resolve,reject)=>{
            this.inGameLoopControl = true;

            console.log(`check if current player's (${this.currentPlayer.name}) turn should be finished.`);

            console.log(this.currentPlayer.attacked,this.currentPlayer.turnWillFinish) ;
            if (this.currentPlayer.attacked || this.currentPlayer.turnWillFinish) {
                resolve();
            }else {
                this.inGameLoopControl = false;
                reject(new Error(NO_TURN_END));        //not a real error, use this to control the game flow
            }
        });
        
    };

    endCurrentTurnStart =()=>{
        return new Promise ((resolve)=>{

            console.log(`Reset all the pokemon state`);

            //reset active pokemon statues

            //const afterPokemonRest=()=>{
              //  resolve();
            //};

            this.currentPlayer.resetPokemonState(resolve);
            
        });
    };

    endCurrentFinished=()=>{
         console.log(`${this.currentPlayer.name}'s turn finished.`);
         this.switchPlayer();
         this.currentPlayer.resetTurn();
         this.inGameLoopControl = false;                //give back to game loop
    };

    gameLoop = (i = 0) => {


        //console.log("main game loop...", i);

        switch (this.gameStage) {

            case GAME_STAGE_SETTING_UP:

                if (this.inGameLoopControl) break;
                console.log("setting up the game");

                this.loadDecks()
                    .then(this.initialPlayers)
                    .then(this.pickFirstPlayer)
                    .then(this.finishSettingUp);
                break;

            case GAME_STAGE_INIT_ACTIVE:
                if (this.inGameLoopControl) break;                //if already in controlled game flow mood ,do nothing, let the current stage continue

                if (!this.currentPlayer.hasActivePokemon()) {       //no active pokemon, game control steps in

                    this.inGameLoopControl = true;                //set the controlling flag
                    console.log(this.currentPlayer.name, " prepare hand and active");

                    this.prepareFirstHand()
                        .then(this.setActivePokemon)
                        .then(this.finishInitActivePokemon)
                        .catch(this.mulliganOccurred);

                } else {

                    if (this.currentPlayer.opponent.hasActivePokemon()) //both players finished first hand cards process
                        this.gameStage = GAME_STAGE_INIT_PRIZE;       //change game stage

                    this.switchPlayer();               // switch to another player to prepare first hand cards and active pokemon

                }

                break;

            case GAME_STAGE_INIT_PRIZE:
                if (this.inGameLoopControl) break;

                this.inGameLoopControl = true;
                this.drawPrizeCard()
                    .then(this.processMulligan)
                    .then(this.finishDrawPrize);

                break;

            case  GAME_STAGE_INIT_BENCH:
                if (this.inGameLoopControl) break;

                if (!this.currentPlayer.isBenchReady) {

                    this.inGameLoopControl = true;
                    console.log(this.currentPlayer.name, " prepare the bench");

                    this.prepareBench()
                        .then(this.finishInitBench);

                } else {

                    if (this.currentPlayer.opponent.isBenchReady) {  //both players finished bench

                        this.showPokemonOnBench()    //show bench only both side finished prepare bench ,then change game stage
                            .then(this.switchPlayer);

                    } else {
                        this.switchPlayer();              // switch to another player to prepare the bench
                    }

                }

                break;

            case GAME_STAGE_REGULAR_TURN:
                if (this.inGameLoopControl) break;

                console.log("turn checking...", i);
                this.winnerCheck()
                    .then(this.afterWinnerCheck)
                    .then(this.turnEndingCheck)
                    .then(this.endCurrentTurnStart)
                    .then(this.endCurrentFinished)
                    .catch((jump)=>{

                        switch (jump.message) {
                            case GAME_FINISH:
                                //console.log("game finished, we have a winner");
                                break;
                            case NO_TURN_END:
                                console.log("no turn change,continue player operation");
                                if (this.currentPlayer === this.AI) {    //AI move
                                    this.inGameLoopControl = true;

                                    AI.playTurn(this.AI,this.player,this)
                                        .then(()=>{
                                            this.inGameLoopControl = false;
                                        });
                                    
                                } else{                            //user move

                                }
                                
                                break;
                        }
                    });

                break;
            case GAME_STAGE_ANNOUNCE_WINNER:
                console.log("game finished, we have a winner");
                break;
            default:
        }


        this.timeoutHandler = window.setTimeout(() => {
            this.gameLoop(++i);
        }, this.state.interval);

    };


    runGame = () => {
        this.setState({isRunning: true});
        this.gameLoop();
    }

    stopGame = () => {

        this.setState({isRunning: false});

        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }

        if (this.activePokemonTimer) {
            window.clearTimeout(this.activePokemonTimer);
            this.activePokemonTimer = null;
        }

        if (this.benchPokemonTimer) {
            window.clearTimeout(this.benchPokemonTimer);
            this.benchPokemonTimer = null;

        }
    }

    componentDidMount() {

        const node = this.GameBoard.current;

        node.addEventListener('mousemove', this.handleMouseMove);
        node.addEventListener('mouseup', this.handleMouseUp);

        //this.muteAllOperation();

        this.runGame();


    }

    componentWillUnmount() {

        const node = this.GameBoard.current;

        node.removeEventListener('mousemove', this.handleMouseMove);
        node.removeEventListener('mouseup', this.handleMouseUp);

        this.stopGame();
        //this.resetAllOperation();

    }

    handleMouseMove = ({pageX, pageY}) => {

        if (this.currentPlayer === this.player) {


            const {isPressed, topDeltaX, topDeltaY, selectedIndex} = this.state;


            if (isPressed && typeof selectedIndex === 'number' && this.player.cards[selectedIndex].stack.draggable) {
                //console.log("current location:", {pageX, pageY});

                const card = this.player.cards[selectedIndex];
                const offset = card.stack.Cards.get(selectedIndex);

                const cardX = pageX - topDeltaX;
                const cardY = pageY - topDeltaY;

                card.stack.Cards.set(selectedIndex, {top: cardY, left: cardX, zIndex: offset.zIndex});

                this.forceUpdate();
            }
        }

    };

    handleMouseUp = ({pageX, pageY}) => {

        if (this.currentPlayer === this.player) {

            console.log("mouse released at:", {pageX, pageY});
            const {selectedIndex, dragTarget} = this.state;

            if (typeof selectedIndex === 'number' && this.state.dragTarget) {
                let card = this.player.cards[selectedIndex];


                if (card.stack !== dragTarget) {        //drag action triggered


                    if (dragTarget instanceof Pokemon) {

                        this.player.attachToPokemon(dragTarget, selectedIndex);

                    } else {

                        let movable = true;

                        //limit the dragTarget in the game setting up phase.
                        if (this.gameStage === GAME_STAGE_INIT_ACTIVE) {

                            if (dragTarget !== this.player.active) movable = false;

                        }

                        if (this.gameStage === GAME_STAGE_INIT_BENCH) {

                            if (dragTarget !== this.player.bench) movable = false;

                        }

                        if (dragTarget === this.player.pitStop) {
                            if (card instanceof TrainerCard && card.category === TRAINER_SUPPORTER) this.player.applySupporter(selectedIndex);
                        }

                        if (movable) this.player.moveCard(card.stack, dragTarget, selectedIndex);


                        if (movable && this.inGameLoopControl && this.gameLoopFuncStack.length > 0) {
                            const func = this.gameLoopFuncStack.pop();
                            if (func) func();               //continue the game loop
                        }

                    }

                }


            }

            this.player.hand.calculate({});
            this.player.bench.calculate({});

            this.setState({isPressed: false, selectedIndex: null, dragTarget: null});

        }


    };

    handleMouseDown = (index, {pageX, pageY, button}) => {   //pos:the index of card in position

        const card = this.player.cards[index];

        if (!card.stack.draggable) return;
        const {top, left} = card.stack.Cards.get(index);
        console.log(index, {top, left}, {pageX, pageY});
        this.setState({
            topDeltaX: pageX - left,
            topDeltaY: pageY - top,
            isPressed: !button,           //only react to left button (single click)
            selectedIndex: index,
        });
    };

    handleMouseOverOfPokemon = (index) => {
        const {isPressed, selectedIndex} = this.state;
        const pokemon = this.player.cards[index];
        if (isPressed && index !== selectedIndex && pokemon instanceof Pokemon) {

            this.state.dragTarget = pokemon;
            console.log("on Pokemon");
        }
    };

    userFinishTurn =()=>{

        this.currentPlayer.turnWillFinish = true;
        this.inGameLoopControl = false;
        
    };

    renderStacks() {
        const state = this.state;

        if (this.deckLoaded)
            return (
                <div>
                    <CoinPic face_up={this.player.isFirstHandPlayer}/>
                    { this.currentPlayer? (
                        <div><span style={{width:200,
                            display: 'inline-block'}}>Current Player:{this.currentPlayer.name} </span>
                        <Button type="primary" disabled={this.gameStage!==GAME_STAGE_REGULAR_TURN || this.currentPlayer!==this.player} onClick={this.userFinishTurn}>Done</Button>
                        </div>
                    ):null}
                    <Active active={this.player.active}
                            onMouseOver={() => {

                                const active = this.player.active;
                                if (state.isPressed && state.dragTarget !== active) {

                                    const card = this.player.cards[state.selectedIndex];

                                    if (active.Cards.size === 0 && (card instanceof Pokemon || (card instanceof PokemonCard && card.category === POKEMON_BASIC)))
                                        state.dragTarget = active;

                                    console.log('inActive');
                                }
                            }}
                    />

                    <Deck deck={this.player.deck}/>

                    <Bench bench={this.player.bench} onMouseOver={() => {
                        const bench = this.player.bench;
                        if (state.isPressed && state.dragTarget !== bench) {

                            const card = this.player.cards[state.selectedIndex];

                            if (bench.Cards.size < bench.Capacity && card instanceof PokemonCard && card.category === POKEMON_BASIC)
                                state.dragTarget = bench;

                            console.log('inBench');
                        }
                    }}/>


                    <Hand hand={this.player.hand}/>

                    <Discard discard={this.player.discard}/>

                    <Prize prize={this.player.prize}/>

                    <PitStop pitStop={this.player.pitStop} onMouseOver={() => {
                        const pitStop = this.player.pitStop;
                        if (state.isPressed && state.dragTarget !== pitStop) {

                            const card = this.player.cards[state.selectedIndex];

                            if (card instanceof TrainerCard)       //only TrainerCard go here
                                state.dragTarget = pitStop;

                            console.log('inPitStop');
                        }
                    }}/>


                    <Active active={this.AI.active} isOpponent/>

                    <Deck deck={this.AI.deck} className="ai" isOpponent/>

                    <Bench bench={this.AI.bench} isOpponent/>

                    <Hand hand={this.AI.hand} isOpponent/>

                    <Discard discard={this.AI.discard} className="ai" isOpponent/>

                    <Prize prize={this.AI.prize} className="ai" isOpponent/>

                    <PitStop pitStop={this.AI.pitStop} isOpponent/>
                </div>
            );
        return null;
    }

    render() {
        const {isPressed, selectedIndex} = this.state;

        const playerCardList = this.player ? this.player.cards.map((card, i) => {

            const active = selectedIndex === i && isPressed;

            const stack = card.stack;

            if (stack) {
                const offset = {...stack.Cards.get(i)};
                let zIndex = card.zIndex + 1;
                if (active) zIndex = 100;
                if (stack === this.player.active) zIndex = 99;

                return (                                 //do not show attached cards
                    <div
                        onMouseDown={this.handleMouseDown.bind(null, i)}
                        //onMouseUp={this.handleMouseUp}
                        onMouseOver={this.handleMouseOverOfPokemon.bind(null, i)}
                        //onMouseOut={this.handleMouseOut.bind(null, i)}
                        //onContextMenu={this.onContextMenu.bind(null, i)}
                        //onClick={this.handleOnClick.bind(null,i)}
                        className="card-container player"
                        key={card.instantKey} style={{zIndex: zIndex}}>
                        {card instanceof Pokemon ? <PokemonView pokemon={card} width={stack.CardWidth}
                                                                x={offset.left}
                                                                y={offset.top} attack={stack === this.player.active}
                                                                onAttack={this.onAttack}
                                                                onRetreat={this.onRetreat}
                                                                retreatalbe={this.player.bench.Cards.size}

                        /> : <CardView card={card} face_down={stack.face_down} width={stack.CardWidth}
                                       x={offset.left}
                                       y={offset.top} glow={card.glow && !active}

                        />}
                    </div>
                );
            } else {
                return null;
            }
        }) : null;

        const aiCardList = this.AI ? this.AI.cards.map((card, i) => {

            const active = false;

            const stack = card.stack;

            if (stack) {
                const offset = stack.Cards.get(i);

                return (                                 //do not show attached cards
                    <div
                        className="card-container"
                        key={card.instantKey} style={{zIndex: offset.zIndex + 1}}>
                        {card instanceof Pokemon ? <PokemonView pokemon={card} width={stack.CardWidth}
                                                                x={offset.left}
                                                                y={offset.top} attack={active}

                        /> : <CardView card={card} face_down={stack.face_down} width={stack.CardWidth}
                                       x={offset.left}
                                       y={offset.top} immediate={active} glow={card.glow}

                        />}
                    </div>
                );
            } else {
                return null;
            }
        }) : null;

        return (
            <div className="welcome-content" ref={this.GameBoard} id="gameLoop">
                {playerCardList}
                {aiCardList}

                {this.renderStacks()}

            </div>
        );
    }

}