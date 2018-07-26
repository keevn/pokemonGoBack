import React from 'react';
import './CardBox.css';

class CardBox extends React.Component {

    constructor(props) {
        super(props);

        const {id} = props;
        const scale = (props.CardSize? (props.CardSize/200):1)*.75;
        const shadow = 5;

        this.mainStyle = {
            transform: `scale(${scale})`,
            WebkitTransform: `scale(${scale})`,
            transformOrigin: '0 0 0',
            transformStyle: 'preserve-3d',
            backgroundImage: 'url(' + require(`./images/cards/${id}.png`) + ')',
            transition: 'background-image 1s ease-in-out',
            backgroundSize: 'cover',
            position: 'relative',
        };

        this.glowStyle = {
            border: '#35a5e5 2px solid',
            boxShadow: `rgba(81, 203, 238, 1) 0px 0px ${2 * shadow}px 0px`,
        };

        this.faceDownStyle = {
            backgroundImage: 'url(' + require(`./images/back.png`) + ')',
            backgroundSize: 'cover',
        };

    };

    render() {

        const {face_up, glow} = this.props;

        const style = Object.assign({}, this.mainStyle, glow ? this.glowStyle : {}, face_up ?  {}:this.faceDownStyle);

        return (
            <div className='card' style={style}>
            <div />
            </div>

        );
        
    }
}

export default CardBox;