import { USER_LOGIN,USER_LOGOUT,USER_SIGNUP,GET_CURRENT_USER } from '../types/user';


export const login = (username,password) => {
    return dispatch => {
        dispatch({
            type: USER_LOGIN,
            payload: {
                username,
                password,
            }
        });
    };
};

export const setLoading = (isLoading) => {
    return dispatch => {
        dispatch({
            type: USER_LOGIN,
            payload: {
                isLoading
            }
        });
    };
};


export const loadCurrentUser =(currentUser)=>{
    return dispatch => {
        dispatch({
            type: GET_CURRENT_USER,
            payload:{
                currentUser
            }
        });
    };
};

export const logout = () => {
    return dispatch => {
        dispatch({
            type: USER_LOGOUT
        });
    };
};

export const signup = () => {
    return dispatch => {
        dispatch({
            type: USER_SIGNUP
        });
    };
};