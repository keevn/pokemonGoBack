import React from 'react';
import ReactDOM from 'react-dom';

export default class Deck extends React.Component {

    constructor(props) {
        super(props);

        this.deckEl = React.createRef();
        this.top = props.deck.Origin.top;
        this.left = props.deck.Origin.left;
        this.width =props.deck.Width;
        this.height=props.deck.Height;

    }

    componentDidMount() {
        const node = this.deckEl.current;

        const domNode = ReactDOM.findDOMNode(node);
        this.screenPositon = domNode.getBoundingClientRect();

        console.log(this.screenPositon);

    };


    render() {
        return (
            <div className="user-deck" style={{
                top: this.top,
                left: this.left,
                position: 'absolute',
                width: this.width,
                height: this.height,
                backgroundColor: '#aaaaaa',
                zIndex:1,
            }}
                 ref={this.deckEl}>
                Deck
            </div>
        );
    }
}