import React from 'react';
import {Spring, animated} from 'react-spring';
import './CardView.css';

class CardView extends React.Component {

    hidden = {
        transform: 'rotateY(180deg)',
    };

    baseStyle = {
        transformOrigin: '0 0 0',
        transition: 'transform 1s',
    };


    constructor(props) {
        super(props);

        this.instantKey=props.instantKey;

        this.cardEl = React.createRef();

        this.faceDown = {
            border: 0,
            backgroundImage: 'url(' + require(`./images/back.png`) + ')',
            transform: 'rotateY(180deg)',
        };

    };

    componentDidMount() {
        this.node = this.cardEl.current.node;
    }

    callback = () => {
        console.log("Card movement finished!");
    }
    

    render() {

        const {face_down = false, glow = false, width = 250, x = 0, y = 0, afterMove = this.callback, immediate = false,card} = this.props;


        let {pic_id} = this.props;

        if (!pic_id) pic_id = card.cardId;

        this.faceUp = {
            zIndex: 1,
            backgroundImage: 'url(' + require(`./images/cards/${pic_id}.png`) + ')'
        };


        const scale = width ? (width / 250) : 1;


        const style = Object.assign({}, this.baseStyle, {
            transform: `scale3d(${scale},${scale},1)`,
            WebkitTransform: `scale3d(${scale},${scale},1)`,
        })

        const isFlippingStyle = Object.assign({}, face_down ? this.hidden : {});


        const className = `cardView${glow ? ' glow' : ''}`;

        return (
            <Spring native immediate={immediate} to={{ x, y}} >
                {({x, y}) => (
                    <animated.div className='card-box' style=
                        {
                            {
                                width: width,
                                height: 345 * scale,
                                top: y,
                                left: x,
                                position: 'absolute',
                            }
                        } ref={this.cardEl} >
                        <div style={style}>
                            <div className={className} style={isFlippingStyle}>
                                <div className='card__face' style={this.faceUp}>{this.props.children}</div>
                                <div className='card__face' style={this.faceDown}/>
                            </div>
                        </div>
                    </animated.div>
                )}
            </Spring>
        );

    }
}

export default CardView;