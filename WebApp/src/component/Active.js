import React from 'react';
import ReactDOM from 'react-dom';
import './Active.css';

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

        const {active} = this.props;

        const className = `active${active.Offsets.size ? '' : ' glow'}`;

        return (
            <div className={className} style={{
                top: this.top,
                left: this.left,
                position: 'absolute',
                width: this.width,
                height: this.height,
                backgroundColor: '#aaaaaa',
                zIndex:1,
                writingMode: 'vertical-rl',
                fontSize:100,
                color: '#5a3030',
            }}
                 ref={this.activeEl}  onMouseOver={this.props.onMouseOver}>
                Active
            </div>
        );
    }
}