import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {productListReducer,productDetailsReducer} from './reducers/productReducers'
import { cartReducer } from './reducers/cartreducers'
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer } from './reducers/userReducers'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
})

const CartStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const UserInfoStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const ShippingAddressStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}
const initialState = {
    cart :{ cartItems: CartStorage, shippingAddress: ShippingAddressStorage },
    userLogin: { userInfo: UserInfoStorage},
}
const middleware = [thunk]

const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))


export default store

