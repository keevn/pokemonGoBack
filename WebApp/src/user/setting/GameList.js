import React, {Component} from 'react';
import {getUserGames} from '../../util/APIUtils';
import {castVote} from '../../util/APIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';
import {Button, Icon, notification} from 'antd';
import {LIST_SIZE} from '../../constants';
import {withRouter} from 'react-router-dom';
import './GameList.css';

class GameList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
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
    }

    loadDeckList(page = 0, size = LIST_SIZE) {
        let promise;
        if (this.props.username)
            promise = getUserGames(this.props.username, page, size);


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
                    games: polls.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentWillMount() {
        this.loadDeckList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                games: [],
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

        return (
            <div className="games-container">
                {
                    !this.state.isLoading && this.state.games.length === 0 ? (
                        <div className="no-decks-found">
                            <span>No Game record Found.</span>
                        </div>
                    ) : null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-games">
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

export default withRouter(GameList);