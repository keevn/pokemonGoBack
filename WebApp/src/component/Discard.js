import React from 'react';
import ReactDOM from 'react-dom';
import './Discard.css';

export default class Discard extends React.Component {

    constructor(props) {
        super(props);

        this.discardEl = React.createRef();
        this.top = props.discard.Origin.top;
        this.left = props.discard.Origin.left;
        this.width =props.discard.Width;
        this.height=props.discard.Height;


        this.className = this.props.className ? this.props.className + " discard" : "discard";

        this.spanStyle = {
            fontSize: this.width / 4.8,
        };

        this.spanStyle = Object.assign({},this.spanStyle,this.props.className ? {
            right: -(this.width / 4),}:{
            marginLeft: this.width+2,});

    }

    componentDidMount() {
        const node = this.discardEl.current;

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
                fontSize:40,
                color: '#2f2f2f',
            }}
                 ref={this.discardEl}>
                Discard
                <span style={this.spanStyle}>{this.props.discard.Offsets.size}</span>
            </div>
        );
    }
}