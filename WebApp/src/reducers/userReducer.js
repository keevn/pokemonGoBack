import {USER_LOGIN, USER_LOGOUT, USER_SIGNUP, USER_LOADING, GET_CURRENT_USER} from '../types/user';


const initialState = {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false
};

export default (state = initialState, action) => {

    if (action.type === USER_LOGIN ) {
        return Object.assign({}, state, {
            isLoading: true
        });
    }

    if (action.type === USER_LOGOUT) {
        return Object.assign({}, state, {
            currentUser:null,
            isAuthenticated:false,
            isLoading: false
        });
    }

    if (action.type === USER_SIGNUP) {
        return Object.assign({}, state, {
            pending: false,
            logged: action.logged
        });
    }

    if (action.type === USER_LOADING ) {
        return Object.assign({}, state, {
            isLoading: action.payload.isLoading
        });
    }


    if (action.type === GET_CURRENT_USER ) {
        return Object.assign({}, state, {
            currentUser:action.payload.currentUser,
            isAuthenticated:true,
            isLoading: false
        });
    }


    return state;
} ;
