import React from 'react';
import ReactDOM from 'react-dom';
import './Prize.css';

export default class Prize extends React.Component {

    constructor(props) {
        super(props);

        this.prizeEl = React.createRef();
        this.top = props.prize.Origin.top;
        this.left = props.prize.Origin.left;
        this.width =props.prize.Width;
        this.height=props.prize.Height;


        this.className = this.props.className ? this.props.className + " prize" : "prize";

        this.spanStyle = {
            fontSize: this.width / 4.8,
        };

        this.spanStyle = Object.assign({},this.spanStyle,this.props.className ? {
            right: -(this.width / 4),}:{
            marginLeft: this.width+2,});

    }

    componentDidMount() {
        const node = this.prizeEl.current;

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
                 ref={this.prizeEl}>
                Prize
                <span style={this.spanStyle}>{this.props.prize.Cards.size}</span>
            </div>
        );
    }
}