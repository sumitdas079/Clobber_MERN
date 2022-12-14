import axios from 'axios'
import { ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL, 
    ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL,
    ORDER_GET_MY_REQUEST, ORDER_GET_MY_SUCCESS, ORDER_GET_MY_FAIL } from '../constants/orderConstant'
import { logout } from '../actions/userActions'

export const createOrder = (order) => async(dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST })

        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {  'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}` },
        }
        const { data } = await axios.post(`api/orders`, order, config)
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data })

    } catch (error) {

        const message = error.response && error.response.data.message ? error.response.data.message : error.message   
        if(message === 'Not Authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: message,
        })
    }
}

export const getOrderDetails = (id) => async(dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST })

        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {  Authorization: `Bearer ${userInfo.token}` },
        }
        const { data } = await axios.get(`/api/orders/${id}`, config)
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data })

    } catch (error) {

        const message = error.response && error.response.data.message ? error.response.data.message : error.message   
        if(message === 'Not Authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: message,
        })
    }
}

export const payOrder = (orderId,paymentResult) => async(dispatch, getState) => {
    try {
        dispatch({ type: ORDER_PAY_REQUEST })

        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {  ContentType: 'application/json',
                        Authorization: `Bearer ${userInfo.token}` },
        }
        const { data } = await axios.put(`/api/orders/${orderId}/pay`,paymentResult, config)
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data })

    } catch (error) {

        const message = error.response && error.response.data.message ? error.response.data.message : error.message   
        if(message === 'Not Authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: message,
        })
    }
}

export const ListMyOrders = () => async(dispatch, getState) => {
    try {
        dispatch({ type: ORDER_GET_MY_REQUEST })

        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {  'Content-Type': 'application/json', 
                        Authorization: `Bearer ${userInfo.token}` },
        }
        const { data } = await axios.get(`/api/orders/myorders`,config)
        dispatch({ type: ORDER_GET_MY_SUCCESS, payload: data })

    } catch (error) {

        const message = error.response && error.response.data.message ? error.response.data.message : error.message   
        if(message === 'Not Authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: ORDER_GET_MY_FAIL,
            payload: message,
        })
    }
}