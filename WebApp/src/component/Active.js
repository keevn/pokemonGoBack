import React from 'react';
import ReactDOM from 'react-dom';

export default class Active extends React.Component {

    constructor(props) {
        super(props);

        this.activeEl = React.createRef();
        this.top = props.active.Origin.top;
        this.left = props.active.Origin.left;
        this.width =props.active.Width;
        this.height=props.active.Height;

    }

    componentDidMount() {
        const node = this.activeEl.current;

        const domNode = ReactDOM.findDOMNode(node);
        this.screenPositon = domNode.getBoundingClientRect();

        console.log(this.screenPositon);

    };


    render() {
        return (
            <div className="user-active" style={{
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
                 ref={this.activeEl}  onMouseOver={this.props.onMouseOver}>
                Active
            </div>
        );
    }
}