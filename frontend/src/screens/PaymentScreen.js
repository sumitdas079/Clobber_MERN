import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import { getUserDetails } from '../actions/userActions'

const PaymentScreen = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    if(!shippingAddress)
    {
        navigate('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card')

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
                    <Form.Check type='radio' label='Credit/Debit Card' id='Credit/Debit Card' name='paymentMethod' 
                    value='Credit/Debit Card' checked={paymentMethod==='Credit/Debit Card'} onChange={(e) => setPaymentMethod(e.target.value)}/>

                    <Form.Check type='radio' label='PayPal' id='PayPal' name='paymentMethod' 
                    value='PayPal' checked={paymentMethod==='PayPal'} onChange={(e) => setPaymentMethod(e.target.value)}/>
                </Col>
                </Form.Group>

                <Button type='submit' variant='info' className='mt-4'>Continue...</Button>
            </Form>

        </FormContainer>
  )
}

export default PaymentScreen