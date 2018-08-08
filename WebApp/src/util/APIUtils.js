import {API_BASE_URL, LIST_SIZE, ACCESS_TOKEN} from '../constants';
import {notification} from 'antd';
import {logout} from "../actions/user";
import store from "../store";


const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};


export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserDecks(username, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/decks?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserDefaultDeck(username) {

    return request({
        url: API_BASE_URL + "/users/" + username + "/deck",
        method: 'GET'
    });

}

export function getDeckList(username) {
    return request({
        url: API_BASE_URL + "/users/" + username + "/all_decks",
        method: 'GET'
    });
}

export function uploadDeckFile(formData, onSuccess, onError) {


    let options = {
        url: API_BASE_URL + "/uploadFile",
        method: 'POST',
        body: formData,
    };

    const headers = new Headers({
        'Accept': 'application/json'
    });


    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(onSuccess)
        .catch(onError);
}


export function getUserGames(username, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/games?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function joinGame(username) {

    return request({
        url: API_BASE_URL + "/game/join" + username,
        method: 'GET'
    });

}

export function handleLogout({
                                 redirectTo = "/login", notificationType = "success",
                                 description = "You're successfully logged out.",
                                 history
                             }) {

    localStorage.removeItem(ACCESS_TOKEN);

    store.dispatch(logout());

    history.push(redirectTo);

    notification[notificationType]({
        message: 'PokemonGoBack',
        description: description,
    });

};

export function saveStep(step) {
    return request({
        url: API_BASE_URL + "/game/saveStep",
        method: 'POST',
        body: JSON.stringify(step)
    });
}