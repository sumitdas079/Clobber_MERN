import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Form, Button, Col } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
}

const CheckoutFormStripe = ({ totalPrice, paymentHandler }) => {

    const [error, setError] = useState(null)
    const [clientSecret, setClientSecret] = useState(null)
    const [processing, setProcessing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
        const createPaymentIntent = async () => {
            const { data } = await axios.post('/api/payments/config/stripe-payment-intent',
                {
                    amount: totalPrice.toFixed(0),
                    currency: 'inr',
                }
            )
            setClientSecret(data.client_secret)
        }
        createPaymentIntent()
    }, [totalPrice])


    const handleChange = async (e) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(e.empty)
        setError(e.error ? e.error.message : '')
    }

    const handleSubmit = async (e) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        e.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'John Doe',
                },
            },
        });

        if (result.error) {
            setError(`Payment failed ${result.error.message}`);
            console.log(result.error.message);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);

            if (result.paymentIntent.status === 'succeeded') {
                console.log('[PaymentIntent]', result.paymentIntent);
                paymentHandler(result.paymentIntent);
            }
        }
    }

    return (
        <>
            {processing && <Loader />}
            {error && <Message variant='danger'>{error}</Message>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className='py-3'>
                    <Form.Label>Enter your card info: </Form.Label>
                    <Col>
                        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <div className='d-grid'>
                    <Button disabled={!stripe || disabled || succeeded || processing} size='lg' type='submit'>Pay Now</Button>
                </div>
            </Form>
        </>
    )
}

export default CheckoutFormStripe