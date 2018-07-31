import React from 'react';
import ReactDOM from 'react-dom';

export default class Bench extends React.Component {

    constructor(props) {
        super(props);

        this.benchEl = React.createRef();
        this.top = props.bench.Origin.top;
        this.left = props.bench.Origin.left;
        this.width =props.bench.Width;
        this.height=props.bench.Height;

    }

    componentDidMount() {
        const node = this.benchEl.current;

        const domNode = ReactDOM.findDOMNode(node);
        this.screenPositon = domNode.getBoundingClientRect();

        console.log(this.screenPositon);

    };


    render() {
        return (
            <div className="user-bench" style={{
                top: this.top,
                left: this.left,
                position: 'absolute',
                width: this.width,
                height: this.height,
                backgroundColor: '#aaaaaa',
                zIndex:0,
                fontSize:140,
                color: '#2f2f2f',
            }}
                 ref={this.benchEl}  onMouseOver={this.props.onMouseOver}>
                Bench
            </div>
        );
    }
}