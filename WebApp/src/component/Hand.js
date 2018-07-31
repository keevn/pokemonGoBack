import React from 'react';
import ReactDOM from "react-dom";

export default class Hand extends React.Component {

    constructor(props) {
        super(props);

        this.handEl = React.createRef();
        this.top = props.hand.Origin.top;
        this.left = props.hand.Origin.left;
        this.width =props.hand.Width;
        this.height=props.hand.Height;

    }

    componentDidMount() {
        const node = this.handEl.current;

        const domNode = ReactDOM.findDOMNode(node);
        this.screenPositon = domNode.getBoundingClientRect();

        console.log(this.screenPositon);

    };


    render() {
        return (
            <div className="user-Hand" style={{
                top: this.top,
                left: this.left,
                position: 'absolute',
                width: this.width,
                height: this.height,
                backgroundColor: '#aaaaaa',
                zIndex:0,
                fontSize:150,
                color: '#fff',
            }}
                 ref={this.handEl}>
                Hand
            </div>
        );
    }
}