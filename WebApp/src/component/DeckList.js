import React from 'react';
import ReactDOM from 'react-dom';
import {Select, Form, Switch, Row,Spin} from 'antd';
import {getDeckList} from "../util/APIUtils";

const FormItem = Form.Item;

export default class DeckList extends React.Component {

    constructor(props) {
        super(props);

        const Option = Select.Option;

        this.user = props.user;

        this.handleChange = props.onChange;

        this.state = {
            player_list: [],
            AI_list: [],
            playerShuffle: false,
            AI_Shuffle: false,
        };

        this.opionlist = null;
    }

    onChange = (value,index) => {
       // console.log(value);
        switch (index) {
            case 1:
                this.state.player_list=this.deckList[value].cardList;
                break;
            case 2:
                this.state.AI_list=this.deckList[value].cardList;
                break;
            case 3:
                this.state.playerShuffle=value;
                break;
            case 4:
                this.state.AI_Shuffle=value;
                break;

        }
        this.handleChange(this.state);

    };


    componentDidMount() {
        

        const promise = getDeckList(this.user.username);

        promise
            .then(deckList => {

                this.deckList = deckList;
                this.opionlist = deckList.map((deck,i) =>
                    <Select.Option key={i}>{deck.deckName}</Select.Option>);

                this.userIndex = 2;
                this.aiIndex =0;
                this.onChange(this.userIndex,1);
                this.onChange(this.aiIndex,2);
                this.onChange(false,3);
                this.onChange(false,4);

                this.forceUpdate();

            });


    };


    render() {

        return (
            (this.deckList) ?
            <div>
                <Form layout="inline">
                    <Row gutter={40}>
                        <FormItem label="Player :">
                            <Select defaultValue={this.deckList[this.userIndex].deckName} style={{width: 150}}
                                    onChange={(value)=>{this.onChange(value,1);}}>
                                {this.opionlist}
                            </Select></FormItem> <FormItem label="shuffle :"><Switch defaultChecked={false}
                                                                                     onChange={(value)=>{this.onChange(value,3);}}/>
                    </FormItem>
                    </Row>
                    <Row gutter={40}>
                        <FormItem label="AI :">
                            <Select defaultValue={this.deckList[this.aiIndex].deckName}  style={{width: 150}} onChange={(value)=>{this.onChange(value,2);}}>
                                {this.opionlist}
                            </Select> </FormItem> <FormItem label="shuffle :"> <Switch defaultChecked={false}
                                                                                       onChange={(value)=>{this.onChange(value,4);}}/>
                    </FormItem>
                    </Row>
                </Form>

            </div> : <Spin />
        );

    }


}


