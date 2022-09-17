import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'


const RegisterScreen = () => {
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const {search} = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userRegister = useSelector((state) => state.userRegister)
    
    const { loading, error, userInfo } = userRegister

    const redirect = search ? search.split('=')[1] : '/'

    useEffect(() => {
        if(userInfo)
        {
            navigate(redirect)
        }
    },[navigate,userInfo,redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword)
        {
            setMessage('Passwords do not match')
        }
        else{
            dispatch(register(name,email,password))
        }
    }

  return (
    <FormContainer>
        <h1>SIGN UP</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler}>

            <Form.Group controlId='name'>
                <Form.Label className='form-label mt-4'>Name</Form.Label>
                <Form.Control type='name' placeholder='Enter your full name' value={name} className='form-control' onChange={(e) => setName(e.target.value)}>
                    
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
                <Form.Label className='form-label mt-4'>Email Address</Form.Label>
                <Form.Control type='email' placeholder='Enter your email' value={email} className='form-control' onChange={(e) => setEmail(e.target.value)}>
                    
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label className='form-label mt-4'>Password</Form.Label>
                <Form.Control type='password' placeholder='Enter your password' value={password} className='form-control' onChange={(e) => setPassword(e.target.value)}>

                </Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmpassword'>
                <Form.Label className='form-label mt-4'>Confirm Password</Form.Label>
                <Form.Control type='password' placeholder='Confirm your password' value={confirmPassword} className='form-control' onChange={(e) => setConfirmPassword(e.target.value)}>

                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-4'>Register</Button>
        </Form>

        <Row className='py-3'>
            <Col>Have an account already?{' '}
            <Link className='text-decoration-none' to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen