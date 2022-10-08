import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { ListMyOrders } from '../actions/orderActions'

const ProfileScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const getMyOrders = useSelector((state) => state.getMyOrders)
    const { loading: loadingOrders, error: errorOrders, orders } = getMyOrders

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
        else {
            if (!user || !user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(ListMyOrders())
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, navigate, userInfo, user])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        }
        else {
            dispatch(updateUserProfile({ id: user._id, name, email, password}))
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>USER PROFILE</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {}
                {error && <Message variant='danger'>{error}</Message>}
                {success && <Message variant='info'>Profile Updated</Message>}
                {loading && <Loader />}
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

                    <Button type='submit' variant='success' className='mt-4'>Update</Button>
                </Form>
            </Col>

            <Col md={9}>
                <h2>MY ORDERS</h2>
                {loadingOrders ? <Loader/> : errorOrders ? <Message variant='danger'>{errorOrders}</Message>
                :(
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.isPaid ? (
                                        order.paidAt.substring(0,10)) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}</td>
                                    <td>{order.isDelivered ? (
                                        order.deliveredAt.substring(0,10)) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}</td>
                                    <td>
                                        <LinkContainer to={`/orders/${order._id}`}>
                                            <Button variant='light'>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfileScreen