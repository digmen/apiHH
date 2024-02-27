
import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
import md5 from 'md5';
import { ACTIONS, BASE_URL } from '../utils/const';

const listContext = createContext();

export function useListContext() {
    return useContext(listContext);
}

const initState = {
    productList: [],
    productFilter: null
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.productList:
            return { ...state, productList: action.payload };
        case ACTIONS.productFilter:
            return { ...state, productFilter: action.payload };
        default:
            return state;
    }
}

function ListContext({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);

    const generateXAuth = () => {
        const password = 'Valantis';
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const xAuth = md5(`${password}_${timestamp}`);
        return xAuth;
    };

    async function getList(offset, limit) {
        try {
            const xAuth = generateXAuth();
            const requestData = {
                action: "get_ids",
                params: { "offset": offset, "limit": limit }
            };

            const response = await axios.post(
                `${BASE_URL}`,
                requestData,
                {
                    headers: {
                        'X-Auth': xAuth,
                        'Content-Type': 'application/json'
                    }
                }
            );
            dispatch({
                type: ACTIONS.productList,
                payload: response.data.result,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const value = {
        getList,
        productList: state.productList,
    };

    return (
        <listContext.Provider value={value}>{children}</listContext.Provider>
    );
}

export default ListContext;
