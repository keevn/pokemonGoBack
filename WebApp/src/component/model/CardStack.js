import range from "lodash.range";
import {shuffle} from '../../util/Helpers';
import {CARD_ENERGY, CARD_POKEMON, CARD_TRAINER, DIRECTION_FROM_TOP} from "../constants";
import {Card, CardTypeError, EnergyCard, PokemonCard, TrainerCard} from "./Card";

export default class CardStack {
    constructor(parameters) {
        const {
            Origin = {
                top: 0,
                left: 0
            }, CardWidth = 250, Capacity = 1, Margin = 5, face_down = true, draggable = false, clickable = false, Cards
        } = parameters;

        this.Origin = {top: Origin.top, left: Origin.left};
        this.CardWidth = CardWidth;
        this.CardHeight = (CardWidth / 250) * 345;
        this.Capacity = Capacity;
        this.Margin = Margin;
        this.Width = 0;
        this.Height = 0;
        this.face_down = face_down;
        this.draggable = draggable;
        this.clickable = clickable;
        this.Cards = new Map();

        this.calculate({Cards});
    }


    static getDeck = ({x, y}, Cards = null) => {

        return new Deck({x, y}, Cards);

    };


    static getHand = ({x, y}, face_down = false, draggable = false) => {

        return new Hand({x, y}, face_down, draggable);

    };

    static getBench = ({x, y}, face_down = false, draggable = false) => {

        return new Bench({x, y},face_down, draggable);

    };


    static getActive = ({x, y},face_down=false) => {

        return new Active({x, y},face_down);
    };

    static getPrize = ({x, y}) => {

        return new Prize({x, y});

    };

    static getDiscard = ({x, y}) => {

        return new Discard({x, y});

    };

    static getPitStop = ({x, y}) => {

        return new PitStop({x, y});

    };


    calculate = ({Cards, del = false}) => {
        this.Width = (this.CardWidth + this.Margin) * this.Capacity + this.Margin;
        this.Height = this.CardHeight + this.Margin * 2;

        if (Cards) {                                    //initial card stack with give card info

            if (this.Capacity === 1) {
                Cards.forEach((card, i) => {
                    this.Cards.set(i, {
                        top: this.Origin.top + this.Margin,
                        left: this.Origin.left + this.Margin,
                        zIndex: i + 1
                    });
                });
            } else {
                const size = this.Cards.size;
                const step = (size <= this.Capacity) ? this.CardWidth + this.Margin : (this.Width - 2 * this.Margin - this.CardWidth) / (size - 1);
                const offsetX = this.Origin.left + this.Margin;
                const offsetY = this.Origin.top + this.Margin;
                Cards.forEach((card, i) => {
                    this.Cards.set(i, {
                        top: offsetY,
                        left: offsetX + step * i,
                        zIndex: i + 1
                    });
                });
            }
        } else {

            if (this.Capacity === 1) {
                const offsetX = this.Origin.left + this.Margin;
                const offsetY = this.Origin.top + this.Margin;
                let i = 0;
                for (let [key, offset] of this.Cards.entries()) {

                    const zIndex = del ? i + 1 : offset.zIndex;               //keep the order of cards in stack

                    this.Cards.set(key, {
                        top: offsetY,
                        left: offsetX,
                        zIndex: zIndex
                    });
                    i++;
                }

            } else {
                const size = this.Cards.size;
                const step = (size <= this.Capacity) ? this.CardWidth + this.Margin : (this.Width - 2 * this.Margin - this.CardWidth) / (size - 1);
                const offsetX = this.Origin.left + this.Margin;
                const offsetY = this.Origin.top + this.Margin;
                let i = 0;
                for (let [key, offset] of this.Cards.entries()) {

                    const zIndex = del ? i + 1 : offset.zIndex;               //keep the order of cards in stack
                    this.Cards.set(key, {top: offsetY, left: offsetX + step * (zIndex - 1), zIndex: zIndex});

                    i++;
                }
            }


        }

    };

    reset = ({Cards}) => {
        this.Cards = new Map();
        this.calculate({Cards});
    }

    addCard = (key, zIndex) => {

        if (!zIndex || zIndex > this.Cards.size) {

            this.Cards.set(key, {zIndex: this.Cards.size + 1});
            this.calculate({});
        }
        else {
            for (let [key, offset] of this.Cards.entries()) {

                if (zIndex <= offset.zIndex) this.Cards.set(key, {zIndex: offset.zIndex + 1});

            }
            this.Cards.set(key, {zIndex: zIndex});
            this.calculate({});
        }

    };

    shuffle = () => {

        let oldOrder=[];

        for (let  offset of this.Cards.values()) {

            oldOrder.push(offset.zIndex);

        }

        console.log(oldOrder);

        let newOrder = shuffle(range(1, this.Cards.size + 1));

        let i = 0;
        for (let key of this.Cards.keys()) {

            this.Cards.set(key, {zIndex: newOrder[i]});

            i++;
        }
        this.calculate({});

        console.log(newOrder);
    };

    addAttachCard = (key, offset) => {

        this.Cards.set(key, offset);

        setTimeout(() => {
            this.Cards.delete(key);
        }, 2000);

    };

    removeCard = (keys) => {

        if (!Array.isArray(keys)) keys = [keys];

        let deleted = false;
        keys = keys.map(key => {
            if (!this.Cards.has(key)) return null;
            this.Cards.delete(key);
            deleted = true;
            return key;
        });

        if (deleted) {

            this.calculate({del: true});
            return keys.length === 1 ? keys[0] : keys;

        } else return null;
        
    };

    popCardIds = (n=1,direction = DIRECTION_FROM_TOP) => {

        if (this.Cards.size < 1) return null;

        let cardsInfo=[];

        for (let [key, offset] of this.Cards.entries()) {

            cardsInfo.push({zIndex:offset.zIndex,key:key});

        }

        cardsInfo.sort((a,b)=>{

            if (a.zIndex < b.zIndex) {
                return (direction===DIRECTION_FROM_TOP)? 1:-1;
            }
            if (a.zIndex > b.zIndex) {
                return (direction===DIRECTION_FROM_TOP)? -1:1;
            }
            return 0;
        });

        return cardsInfo.slice(0,n).map((info)=>info.key);

    };

    popCard = () => {

        if (this.Cards.size < 1) return null;

        let minZIndex = 99;
        let findKey = null;

        for (let [key, offset] of this.Cards.entries()) {

            if (offset.zIndex < minZIndex) {
                minZIndex = offset.zIndex;
                findKey = key;
            }

        }

        if (minZIndex > 0) return this.removeCard(findKey);

    }


    isInside = ({x, y}) => {

        if (x < this.Origin.left + this.Margin || x > this.Origin.left + this.Width - this.Margin) return false;
        // console.log(this.Origin.top+this.Margin,this.Origin.top+this.Height-this.Margin,y)
        return !(y < this.Origin.top + this.Margin || y > this.Origin.top + this.Height - this.Margin);
    };

    _isInsideOfCard = ({x, y}, key) => {

        if (!this.isInside({x, y})) return false;

        if (x < this.Cards.get(key).left || x >= this.Cards.get(key).left + this.CardWidth) return false;

        return !(y < this.Cards.get(key).top || y >= this.Cards.get(key).top + this.CardHeight);


    };

    getKeyOfMouseOverCard = ({x, y}) => {

        let maxZIndex = -1;

        let findKey = null;

        for (let [key, offset] of this.Cards.entries()) {
            if (this._isInsideOfCard({x, y}, key) && offset.zIndex > maxZIndex) {
                maxZIndex = offset.zIndex;
                findKey = key;
            }
        }

        return findKey;

    }


}


export class Deck extends CardStack {
    constructor({x, y}, Cards = null) {
        const Origin = {left: x, top: y};
        const CardWidth = 120;
        const Capacity = 1;
        const Margin = 0;
        super({Origin, CardWidth, Capacity, Margin, Cards});
    }

}

export class Hand extends CardStack {

    constructor({x, y}, face_down = false, draggable = false) {

        const Origin = {left: x, top: y};
        const CardWidth = 105;
        const Capacity = 7;
        const Margin = 5;

        super({Origin, CardWidth, Capacity, Margin, face_down, draggable});
    }

}

export class Bench extends CardStack {                         

    constructor({x, y},face_down = false, draggable = false) {

        const Origin = {left: x, top: y};

        const CardWidth = 120;
        const Capacity = 5;
        const Margin = 5;
        const clickable = true;

        super({Origin, CardWidth, Capacity, Margin, face_down, draggable, clickable});
    }
}


export class Active extends CardStack {

    constructor({x, y},face_down=false) {

        const Origin = {left: x, top: y};

        const CardWidth = 230;
        const Capacity = 1;
        const Margin = 10;
        const clickable = true;

        super({Origin, CardWidth, Capacity, Margin, face_down, clickable});
    }


}

export class Prize extends CardStack {

    constructor({x, y}) {

        const Origin = {left: x, top: y};

        const CardWidth = 120;
        const Capacity = 1;
        const Margin = 0;
        const clickable = true;

        super({Origin, CardWidth, Capacity, Margin, clickable});
    }

}

export class Discard extends CardStack {

    constructor({x, y}) {

        const Origin = {left: x, top: y};

        const CardWidth = 120;
        const Capacity = 1;
        const Margin = 0;
        const face_down = false;
        const clickable = true;

        super({Origin, CardWidth, Capacity, Margin, face_down, clickable});
    }

}

export class PitStop extends CardStack {

    constructor({x, y}) {

        const Origin = {left: x, top: y};

        const CardWidth = 120;
        const Capacity = 1;
        const Margin = 0;
        const face_down = false;

        super({Origin, CardWidth, Capacity, Margin, face_down});
    }

}

function reinsert(arr, from, to) {
    const _arr = arr.slice(0);
    const val = _arr[from];
    _arr.splice(from, 1);
    _arr.splice(to, 0, val);
    return _arr;
}

function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}