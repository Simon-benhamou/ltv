import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { history, fetchWrapper } from '_helpers';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode'
// create slice

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        token: Cookies.get('jwt') || null,
        user:Cookies.get('jwt') ?  jwt_decode(Cookies.get('jwt')) : null,
        error: null
    }
}

function createReducers() {
    return {
        logout
    };

    function logout(state) {
        state.user = null;
        localStorage.removeItem('user');
        Cookies.remove('jwt')
        history.navigate('/login');
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

    return {
        login: login()
    };    

    function login() {
        return createAsyncThunk(
            `${name}/login`,
            async ({ username, password }) => await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        );
    }
}

function createExtraReducers() {
    return {
        ...login()
    };

    function login() {
        var { pending, fulfilled, rejected } = extraActions.login;
        return {
            [pending]: (state) => {
                state.error = null;
            },
            [fulfilled]: (state, action) => {
                const token = action.payload;
                
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                let expires = new Date()
                expires.setTime(expires.getTime() + 84000 * 60 * 1000 * 6)
                Cookies.set('jwt',token,{path:'/',expires})
                state.token = token
                state.user = jwt_decode(token);

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/' } };
                history.navigate(from);
            },
            [rejected]: (state, action) => {
                state.error = action.error;
            }
        };
    }
}
