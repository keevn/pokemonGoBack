import React, {Component} from 'react';
import {getUserDecks, getUserDefaultDeck} from '../../util/APIUtils';
import {castVote} from '../../util/APIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';
import {Button, Icon, Upload, notification} from 'antd';
import {LIST_SIZE} from '../../constants';
import {withRouter} from 'react-router-dom';
import './DeckList.css';

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
            isLoading: false
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
                const polls = this.state.polls.slice();
                const currentVotes = this.state.currentVotes.slice();

                this.setState({
                    polls: polls.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
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
            action: '',
            onChange({file, fileList}) {
                if (file.status !== 'uploading') {
                    console.log(file, fileList);
                }
            },
            defaultFileList: [],
        };

        return (
            <div className="decks-container">
                <h2>Upload deck.</h2>
                <Upload {...props}>
                    <Button>
                        <Icon type="upload"/> Upload
                    </Button>
                </Upload>,
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