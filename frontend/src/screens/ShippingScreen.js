import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingScreen = () => {

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [pincode, setPincode] = useState(shippingAddress.pincode)
    const [country, setCountry] = useState(shippingAddress.country)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, pincode, country }))
        navigate('/payment')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2/>
            <h1>SHIPPING</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address'>
                    <Form.Label className='form-label mt-4'>Address</Form.Label>
                    <Form.Control type='text' placeholder='Enter your address' value={address} required className='form-control' onChange={(e) => setAddress(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='city'>
                    <Form.Label className='form-label mt-4'>City</Form.Label>
                    <Form.Control type='text' placeholder='Enter your city' value={city} required className='form-control' onChange={(e) => setCity(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='pincode'>
                    <Form.Label className='form-label mt-4'>Pin Code</Form.Label>
                    <Form.Control type='text' placeholder='Enter your pin code' value={pincode} required className='form-control' onChange={(e) => setPincode(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='country'>
                    <Form.Label className='form-label mt-4'>Country</Form.Label>
                    <Form.Control type='text' placeholder='Enter your country' value={country} required className='form-control' onChange={(e) => setCountry(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='info' className='mt-4'>Continue...</Button>
            </Form>

        </FormContainer>
    )
}

export default ShippingScreen