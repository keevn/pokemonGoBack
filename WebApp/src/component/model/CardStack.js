import range from "lodash.range";

export default class CardStack {
    constructor(parameters) {
        const {
            Origin = {
                top: 0,
                left: 0
            }, CardWidth = 250, Capacity = 1, Margin = 5, face_down = true, Cards = []
        } = parameters;

        this.Origin = {top: Origin.top, left: Origin.left};
        this.CardWidth = CardWidth;
        this.CardHeight = (CardWidth / 250) * 345;
        this.Capacity = Capacity;
        this.Margin = Margin;
        this.Width = 0;
        this.Height = 0;
        this.face_down = face_down;
        this.Offsets = new Map();

        this.calculate({Cards});
    }

    static getDeck = ({x, y},Cards=null) => {

        let Origin = {left: x, top: y};

        let CardWidth = 120;
        let Capacity = 1;
        let Margin = 0;
        return new CardStack({Origin, CardWidth, Capacity, Margin, Cards});

    };

    static getHand = ({x, y},face_down=false) => {

        let Origin = {left: x, top: y};

        let CardWidth = 110;
        let Capacity = 8;
        let Margin = 5;
        return new CardStack({Origin, CardWidth, Capacity, Margin, face_down});

    };

    static getBench = ({x, y}) => {

        let Origin = {left: x, top: y};

        let CardWidth = 120;
        let Capacity = 5;
        let Margin = 5;
        let face_down = false;
        return new CardStack({Origin, CardWidth, Capacity, Margin,face_down});

    };


    static getActive = ({x, y}) => {

        let Origin = {left: x, top: y};

        let CardWidth = 250;
        let Capacity = 1;
        let Margin = 5;
        let face_down = false;
        return new CardStack({Origin, CardWidth, Capacity, Margin, face_down});

    };

    static getPrize = ({x, y}) => {

        let Origin = {left: x, top: y};

        let CardWidth = 150;
        let Capacity = 1;
        let Margin = 5;
        return new CardStack({Origin, CardWidth, Capacity, Margin});

    };

    static getDiscard = ({x, y}) => {

        let Origin = {left: x, top: y};

        let CardWidth = 150;
        let Capacity = 1;
        let Margin = 5;
        let face_down = false;
        return new CardStack({Origin, CardWidth, Capacity, Margin, face_down});

    };

    static getPitstop = ({x, y}) => {

        let Origin = {left: x, top: y};

        let CardWidth = 150;
        let Capacity = 1;
        let Margin = 5;
        let face_down = false;
        return new CardStack({Origin, CardWidth, Capacity, Margin, face_down});

    };


    calculate = ({Cards, del = false}) => {
        this.Width = (this.CardWidth + this.Margin) * this.Capacity + this.Margin;
        this.Height = this.CardHeight + this.Margin * 2;

        if (Cards) {                                    //initial card stack with give card info

            if (this.Capacity === 1) {
                Cards.forEach((card, i) => {
                    this.Offsets.set(card.instantKey, {
                        top: this.Origin.top + this.Margin,
                        left: this.Origin.left + this.Margin,
                        zIndex: i + 1
                    });
                });
            } else {
                const size = this.Offsets.size;
                const step = (size <= this.Capacity) ? this.CardWidth + this.Margin : (this.Width - 2 * this.Margin - this.CardWidth) / (size - 1);
                const offsetX = this.Origin.left + this.Margin;
                const offsetY = this.Origin.top + this.Margin;
                Cards.forEach((card, i) => {
                    this.Offsets.set(card.instantKey, {
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
                for (let [key, offset] of this.Offsets.entries()) {

                    const zIndex = del ? i + 1 : offset.zIndex;               //keep the order of cards in stack

                    this.Offsets.set(key, {
                        top: offsetY,
                        left: offsetX,
                        zIndex: zIndex
                    });
                    i++;
                }

            } else {
                const size = this.Offsets.size;
                const step = (size <= this.Capacity) ? this.CardWidth + this.Margin : (this.Width - 2 * this.Margin - this.CardWidth) / (size - 1);
                const offsetX = this.Origin.left + this.Margin;
                const offsetY = this.Origin.top + this.Margin;
                let i = 0;
                for (let [key, offset] of this.Offsets.entries()) {

                    const zIndex = del ? i + 1 : offset.zIndex;               //keep the order of cards in stack
                    this.Offsets.set(key, {top: offsetY, left: offsetX + step * (i), zIndex: zIndex});

                    i++;
                }
            }


        }

    };


    addCard = (key, zIndex ) => {

        if (!zIndex || zIndex > this.Offsets.size) {

            this.Offsets.set(key, {zIndex: this.Offsets.size + 1});
            this.calculate({});
        }
        else {
            for (let [key, offset] of this.Offsets.entries()) {

                if (zIndex <= offset.zIndex) this.Offsets.set(key, {zIndex: offset.zIndex + 1});

            }
            this.Offsets.set(key, {zIndex: zIndex});
            this.calculate({});
        }

    };

    removeCard = (keys) => {

        if (!Array.isArray(keys)) keys= [keys];

        let deleted=false;
        keys = keys.map(key=>{
            if (!this.Offsets.has(key)) return null;
            this.Offsets.delete(key);
            deleted=true;
            return key;
        });

        if (deleted) {
            
            this.calculate({del: true});
            return keys.length===1? keys[0]:keys;

        } else return null;
    };

    popCard=()=>{

        if (this.Offsets.size<1) return null;
        
        let minZIndex = 99 ;
        let findKey = null;

        for (let [key, offset] of this.Offsets.entries()) {

            if (offset.zIndex < minZIndex  ) {
                minZIndex = offset.zIndex;
                findKey=key;
            }

        }

        if (minZIndex>0) return this.removeCard(findKey);

    }


    isInside = ({x, y}) => {

        if (x < this.Origin.left + this.Margin || x > this.Origin.left + this.Width - this.Margin) return false;
        // console.log(this.Origin.top+this.Margin,this.Origin.top+this.Height-this.Margin,y)
        return !(y < this.Origin.top + this.Margin || y > this.Origin.top + this.Height - this.Margin);
    };

    _isInsideOfCard = ({x, y}, key) => {

        if (!this.isInside({x, y})) return false;

        if (x < this.Offsets.get(key).left || x >= this.Offsets.get(key).left + this.CardWidth) return false;

        return !(y < this.Offsets.get(key).top || y >= this.Offsets.get(key).top + this.CardHeight);


    };

    getKeyOfMouseOverCard = ({x, y}) => {

        let maxZIndex = -1;

        let findKey = null;

        for (let [key, offset] of this.Offsets.entries()) {
            if (this._isInsideOfCard({x, y}, key) && offset.zIndex > maxZIndex) {
                maxZIndex = offset.zIndex;
                findKey = key;
            }
        }

        return findKey;

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