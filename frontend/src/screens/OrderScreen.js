import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { savePaymentMethod } from '../actions/cartActions'
import { ORDER_PAY_RESET } from '../constants/orderConstant'
import CheckoutFormStripe from '../components/CheckoutFormStripe'
import getDateString from '../utils/getDateString'

const OrderScreen = () => {

    const publish_key = `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
    const stripe_key = loadStripe(publish_key)
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [sdk, setSDK] = useState(false)

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    /* const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver */

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    if (!loading) {
        const addDecimal = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }
        const od = order.orderItems
        order.itemsPrice = addDecimal(od.reduce((acc, item) => acc + item.price * item.qty, 0))
    }

    useEffect(() => {
        if (!order || successPay) {
            if (successPay) { dispatch({ type: ORDER_PAY_RESET }) }
            dispatch(getOrderDetails(id))
        }
    }, [order, id, dispatch, successPay])

    useEffect(() => {
        const addPayPalscript = async () => {
            const { data: clientID } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`
            script.async = true
            script.onload = () => { setSDK(true) }
            document.body.appendChild(script)
        }
        if (!userInfo) {
            navigate('/login')
        }
        if (!sdk) {
            addPayPalscript()
        }
    }, [dispatch, navigate, sdk, successPay, userInfo, order, id])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult);
        dispatch(savePaymentMethod('PayPal'))
        dispatch(payOrder(id, { ...paymentResult, paymentMode: 'paypal' }))
    }

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='secondary'>{error}</Message>
    ) : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Ordered Items</h2>
                            {order.orderItems.length === 0 ? <Message>No orders found!</Message> :
                                (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) =>
                                        (<ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col><Link className='text-decoration-none' to={`/product/${item.product}`}>{item.name}</Link></Col>
                                                <Col md={4}>
                                                    {item.qty} x &#8377; {item.price} = &#8377; {item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>))}
                                    </ListGroup>
                                )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong>
                                {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{' '}
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>{' '}
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}, {order.shippingAddress.pincode}{' '}, {order.shippingAddress.country}
                            </p>
                            <div>
                                {order.isDelivered ? (<Message variant='success'>Delivered on {getDateString(order.deliveredAt)}</Message>) : (<Message variant='secondary'>Not Delivered</Message>)}
                            </div>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            <div>
                                {order.isPaid ? (<Message variant='success'>Paid on {getDateString(order.paidAt)}</Message>) : (<Message variant='secondary'>Not paid</Message>)}
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>&#8377; {order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping Price:</Col>
                                    <Col>&#8377; {order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>&#8377; {order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <>
                                    {order.paymentMethod === 'PayPal' ? (
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}
                                            {!sdk ? (<Loader />) :
                                                (<PayPalButton currency='USD' amount={Number(order.totalPrice / 80).toFixed(2)} onSuccess={successPaymentHandler} />)}
                                        </ListGroup.Item>
                                    ) : (
                                        <ListGroup.Item>
                                            <h6 className='text-primary'>Enter your card information</h6>
                                            {loadingPay && <Loader/>}
                                            {
                                                <Elements stripe={stripe_key}>
                                                    <CheckoutFormStripe price={order.totalPrice*100} orderId={id}/>
                                                </Elements>
                                            }
                                        </ListGroup.Item>
                                    )}
                                </>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrderScreen