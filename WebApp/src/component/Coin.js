import React from 'react';
import random from 'lodash.random';
import './Coin.css';

class Coin extends React.Component {

    constructor(props) {
        super(props);

        const {afterFlip, style, size,times} = props;

        this.returnValue ={head:0,tail:0};

        this.times=times;

        this.callback = afterFlip;

        this.style = style;

        this.size = size ? parseInt(size, 10) : 150;

        this.scale = this.size / 150;

        this.state ={
            flipStyle:{},
        };

        this.hidden = {
            transform: '',
        };

        this.lastTime =  random(1,4);

    }

    componentDidMount(){


         this.flip();
         this.timer = setInterval(this.flip,2500);

    }


    flip = ()=>{

        if (this.times<0) {
            clearInterval(this.timer);
            return;
        }
        
        this.new_value=random(0,1);


        let new_time = random(1, 4);

        while (new_time===this.lastTime){
            new_time = random(1, 4);
        }

        this.lastTime = new_time;

        const flipStyle = {
            animation: 'flip_' + new_time + ' 2s 1 ease',
            animationDelay: '1s',
        };

        this.setState({flipStyle});

        this.times--;



    }
    

    render() {


        return (
            <div>
            <div className='coin_container' style={Object.assign({}, this.style, {
                width: this.size,
                height: this.size,
            })}>
                <div style={{
                    transform: `scale(${this.scale})`,
                    transformOrigin: '0 0',
                }}>
                    <div className='coin' style={this.state.flipStyle}
                         onAnimationEnd={()=>{
                             this.returnValue ={head:this.returnValue.head+this.new_value, tail:this.returnValue.tail+(1-this.new_value)};

                             this.forceUpdate();

                             if (typeof this.callback === 'function' && this.times<0) this.callback(this.returnValue);
                         }}
                    >
                        <div className='coin-face'
                             style={this.new_value ? this.hidden : {transform: 'rotateX(180deg) translateZ(-4px)'}}/>
                        <div className='coin-back'
                             style={this.new_value ? {transform: 'rotateX(180deg) translateZ(4px)'} : this.hidden}/>
                    </div>
                </div>


            </div>
                <span>Head:{this.returnValue.head} Tail:{this.returnValue.tail}</span>
            </div>
        );


    }

};


export default Coin;