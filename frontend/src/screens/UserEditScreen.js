import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstant'


const UserEditScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdate = useSelector((state) => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate


    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            navigate('/admin/userlist')
        }
        else {
            if (!user || !user.name || user._id !== id) {
                dispatch(getUserDetails(id))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }

    }, [dispatch, navigate, successUpdate, id, user, name])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: id, name, email, isAdmin }))
    }

    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) :
                    (
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

                            <Form.Group controlId='isadmin'>
                                <Form.Check type='checkbox' label='Are you an Admin?' checked={isAdmin} className='my-2 py-2' onChange={(e) => setIsAdmin(e.target.checked)}>
                                </Form.Check>
                            </Form.Group>


                            <Button type='submit' variant='primary' className='mt-4'>Update</Button>
                        </Form>
                    )}


            </FormContainer>
        </>
    )
}

export default UserEditScreen