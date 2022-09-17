import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    if(!shippingAddress)
    {
        navigate('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

  return (
    <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <h1>PAYMENT</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend' className='form-label my-4'>Select Payment Method</Form.Label>
                
                <Col>
                    <Form.Check type='radio' label='PayPal or Credit Card' id='PayPal' name='paymentMethod' 
                    value='PayPal' checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                </Col>
                </Form.Group>

                <Button type='submit' variant='info' className='mt-4'>Continue...</Button>
            </Form>

        </FormContainer>
  )
}

export default PaymentScreen