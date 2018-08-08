import React from 'react';
import ReactDOM from 'react-dom';

export default class PitStop extends React.Component {

    constructor(props) {
        super(props);

        this.pitStopEl = React.createRef();
        this.top = props.pitStop.Origin.top;
        this.left = props.pitStop.Origin.left;
        this.width =props.pitStop.Width;
        this.height=props.pitStop.Height;


        this.className = "pitstop";

        this.spanStyle = {
            fontSize: this.width / 4.8,
        };

        this.spanStyle = Object.assign({},this.spanStyle,this.props.className ? {
            right: -(this.width / 4),}:{
            marginLeft: this.width+2,});

    }

    componentDidMount() {
        const node = this.pitStopEl.current;

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
                backgroundColor: '#aaaaaa4d',
                zIndex:1,
            }}
                 ref={this.pitStopEl}>
            </div>
        );
    }
}