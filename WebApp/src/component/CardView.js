import React from 'react';
import './CardView.css';

class CardView extends React.Component {

    constructor(props) {
        super(props);

        const {card} = props;

        let {pic_id} = props;

        if (!pic_id) pic_id = card.id;

        this.faceUp = {
            zIndex: 1,
            backgroundImage: 'url(' + require(`./images/cards/${pic_id}.png`) + ')'
        };

        this.faceDown = {
            border: 0,
            backgroundImage: 'url(' + require(`./images/back.png`) + ')',
            transform: 'rotateY(180deg)',
        };

        this.hidden={
            transform: 'rotateY(180deg)',
        };
    };

    render() {


        const {face_down, glow} = this.props;
        

        const isFlippingStyle=face_down? this.hidden:{};


        const className = `cardView${glow? ' glow':''}`;

        return (
            <div className={className} style={isFlippingStyle}>
                <div className='card__face' style={this.faceUp} >{this.props.children}</div>
                <div className='card__face' style={this.faceDown}/>
            </div>

        );

    }
}

export default CardView;