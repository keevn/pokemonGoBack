import React from 'react';
import ReactDOM from 'react-dom';
import './Deck.css';

export default class Deck extends React.Component {

    constructor(props) {
        super(props);

        this.deckEl = React.createRef();
        this.top = props.deck.Origin.top;
        this.left = props.deck.Origin.left;
        this.width =props.deck.Width;
        this.height=props.deck.Height;


        this.className = this.props.className ? this.props.className + " deck" : "deck";

        this.spanStyle = {
            fontSize: this.width / 4.8,
        };
        
        this.spanStyle = Object.assign({},this.spanStyle,this.props.className ? {
            right:0,marginRight: this.width+2,}:{
            left: 0,marginLeft: this.width+2,});

    }

    componentDidMount() {
        const node = this.deckEl.current;

        const domNode = ReactDOM.findDOMNode(node);
        this.screenPositon = domNode.getBoundingClientRect();

        console.log(this.screenPositon);




    }


    render() {
        return (
            <div className={this.className} style={{
                top: this.top,
                left: this.left,
                position: 'absolute',
                width: this.width,
                height: this.height,
                backgroundColor: '#aaaaaa',
                zIndex:1,
                writingMode: 'vertical-rl',
                fontSize:50,
                color: '#2f2f2f',
            }}
                 ref={this.deckEl}>
                Deck
                <span style={this.spanStyle}>{this.props.deck.Offsets.size}</span>
            </div>
        );
    }
}