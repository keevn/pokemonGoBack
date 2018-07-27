import React from 'react';
import random from 'lodash.random';
import './Coin.css';

class Coin extends React.Component {

    constructor(props) {
        super(props);

        const {afterFlip, style, size} = props;

        this.callback= afterFlip;

        this.style = style;

        this.size = size ? parseInt(size, 10) : 150;

        this.scale = this.size / 150;

        this.hidden = {
            transform: '',
        };

        this.lastTime =  random(1,4);

    }
    

    render() {

        const new_value=random(0,1);

        if (this.callback) setTimeout(()=>this.callback(new_value),2000);

        let new_time = random(1, 4)

        while (new_time===this.lastTime){
            new_time = random(1, 4);
        }

        this.lastTime = new_time;

        const flipStyle = {
            animation: 'flip_' + new_time + ' 2s 1 ease',
        };


        return (
            <div className='coin_container' style={Object.assign({}, this.style, {
                width: this.size,
                height: this.size,
            })}>
                <div style={{
                    transform: `scale(${this.scale})`,
                    transformOrigin: '0 0',
                }}>
                    <div className='coin' style={flipStyle}>
                        <div className='coin-face'
                             style={new_value ? this.hidden : {transform: 'rotateX(180deg) translateZ(-4px)'}}/>
                        <div className='coin-back'
                             style={new_value ? {transform: 'rotateX(180deg) translateZ(4px)'} : this.hidden}/>
                    </div>
                </div>
            </div>
        );


    }

};


export default Coin;