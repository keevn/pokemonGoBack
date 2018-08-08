import React, {Component} from 'react';
import {getUserDecks, getUserDefaultDeck} from '../../util/APIUtils';
import {isValidatedDeck} from '../../util/Helpers';
import LoadingIndicator from '../../layouts/common/LoadingIndicator';
import {Button, Icon, Upload, notification, Form} from 'antd';
import {ACCESS_TOKEN, LIST_SIZE, API_BASE_URL} from '../../constants';
import {withRouter} from 'react-router-dom';
import './DeckList.css';

const FormItem = Form.Item;

class DeckList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            decks: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            fileList: [],
            isLoading: false,
            uploading: false
        };
        this.loadDeckList = this.loadDeckList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.loadDefaultDeck = this.loadDefaultDeck.bind(this);
    }

    loadDefaultDeck() {
        let promise;
        if (this.props.username)
            promise = getUserDefaultDeck(this.props.username);

        if (!promise) {
            return;
        }

        promise
            .then(response => {
            });


    }

    loadDeckList(page = 0, size = LIST_SIZE) {
        let promise;
        if (this.props.username)
            promise = getUserDecks(this.props.username, page, size);


        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const decks = this.state.decks.slice();

                this.setState({
                    decks: decks.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });

    }

    componentWillMount() {
        this.loadDeckList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                decks: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });
            this.loadDeckList();
        }
    }

    handleLoadMore() {
        this.loadDeckList(this.state.page + 1);
    }

    render() {

        const props = {
            name: 'file',
            action: API_BASE_URL + "/uploadDeckFile",
            headers: {
                authorization: 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
            },
            beforeUpload:(file)=>{

                //Todo need to add the invalidated deck file error handler.

                return new Promise(function (resolve, reject) {

                    const reader = new FileReader();
                    
                    reader.onloadend = function (evt) {
                        if (evt.target.readyState === FileReader.DONE) { // DONE == 2

                            const result= evt.target.result.split(/(?:\r\n|\r|\n)/g);
                            //console.log(result);

                            const cardIds = result.map((id)=>parseInt(id,10));
                            //console.log(cardIds);
                            
                            if (isValidatedDeck(cardIds)) {
                                
                                resolve();

                            } else{

                                notification.error({
                                    message: 'PokemonGoBack',
                                    description: file.name + ' file is invalidated, check your file.'
                                });

                                reject(new Error(file.name + ' file is invalidated, check your file.'));

                            }

                        }
                    };

                    reader.readAsText(file);

                });
            },
            showUploadList:false,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    notification.success({
                        message: 'PokemonGoBack',
                        description: info.file.name + ' upload successfully!'
                    });
                } else if (info.file.status === 'error') {
                    notification.error({
                        message: 'PokemonGoBack',
                        description: info.file.name + ' file upload failed.'
                    });
                }
            },
        };

        return (
            <div className="decks-container">
                <h2>Upload deck.</h2>
                <Form>
                    <FormItem>
                        <Upload {...props}>
                            <Button>
                                <Icon type="upload"/> Click to choice deck file
                            </Button>
                        </Upload>
                    </FormItem>
                </Form>

                {
                    !this.state.isLoading && this.state.decks.length === 0 ? (
                        <div className="no-decks-found">
                            <span>No deck data Found.</span>
                        </div>
                    ) : null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-decks">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus"/> Load more
                            </Button>
                        </div>) : null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator/> : null
                }
            </div>
        );
    }
}

export default withRouter(DeckList);