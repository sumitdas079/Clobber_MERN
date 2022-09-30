import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Form, Button } from 'react-bootstrap'
import { payOrder } from '../actions/orderActions'
import { savePaymentMethod } from '../actions/cartActions'
import Message from '../components/Message'

const CheckoutFormStripe = ({price, orderId}) => {

    const [error, setError] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const stripe = useStripe()
    const elements = useElements()
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const {userInfo} = userLogin

    useEffect(() => {
        const getClientSecret = async() => {
            const {data} = await axios.post('/api/orders/stripe-payment',{ price,email: userInfo.email },
            {
                headers:{ 'Content-Type': 'application/json' }
            })
            setClientSecret(data.clientSecret)
        }
        if(userInfo && price)
        {
            getClientSecret()
        }
    },[price,userInfo])


    const makePayment = async(e) => {
        e.preventDefault()
        if(!stripe || !elements) { return }
        if(clientSecret)
        {
            const payload = await stripe.confirmCardPayment(clientSecret,{
                payment_method:{
                    card: elements.getElement(CardElement),
                    billing_details: { name: userInfo.name, email: userInfo.email }
                }
            })
            console.log(payload.error);
            if(!payload.error)
            {
                dispatch(savePaymentMethod('Stripe'))
                dispatch(payOrder(orderId,{
                    ...payload.paymentIntent,
                    payment_method:'stripe'
                }))
            }
            else{
                setError(payload.error.message)
            }
        }
        else{ window.location.reload() }
    }

  return (
    <Form id='payment-form' onSubmit={makePayment}>
        {error && (<Message dismissable variant='danger'>{error}</Message>)}
        <Form.Group className='py-3'>
            <CardElement options={{ style: {
                base:{
                    fontSize:'16px', color: '#424770', '::placeholder': { color: '#aab7c4'}
                },
                invalid:{ color: '#9e2146' }
            }}} id='card-element'/>
        </Form.Group>
        <div className='d-grid'>
            <Button disabled={!stripe} size='lg' type='submit'>Pay Now</Button>
        </div>
    </Form>
  )
}

export default CheckoutFormStripe