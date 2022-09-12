import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'


const LoginScreen = () => {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {search} = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userLogin = useSelector((state) => state.userLogin)
    
    const { loading, error, userInfo } = userLogin

    const redirect = search ? search.split('=')[1] : '/'

    useEffect(() => {
        if(userInfo)
        {
            navigate(redirect)
        }
    },[navigate,userInfo,redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email,password))
    }

  return (
    <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler}>
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

            <Button type='submit' variant='primary' className='mt-4'>Sign In</Button>
        </Form>

        <Row className='py-3'>
            <Col>Don't have an account yet?{' '}
            <Link className='text-decoration-none' to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default LoginScreen