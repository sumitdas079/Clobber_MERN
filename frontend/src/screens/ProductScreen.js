import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const ProductScreen = () => {
    const [qty,setQty] = useState(1)
    const {id} = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const {loading,error,product} = productDetails
    useEffect(() => {
        dispatch(listProductDetails(id))
      },[dispatch,id]) 

    const addtoCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`)
    }
    return (
        <>
            <Link className='btn btn-outline-light my-3' to='/'>Go Back</Link>
            {loading ? <Loader/> : error ? <Message variant='primary'>{error}</Message> : 
            <Row>
            <Col md={6}>
                <Image src={product.image} alt={product.name}/>
            </Col>
            <Col md={3}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>{product.name}</h3>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Price:</strong> &#8377;{product.price}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Description:</strong> {product.description}
                    </ListGroup.Item>
                </ListGroup>
            </Col>

            <Col>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Row>
                                <Col>Price: </Col>
                                <Col><strong>&#8377;{product.price}</strong></Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Status: </Col>
                                <Col>{product.countInStock>0 ? 'In stock' : 'Out of stock'}</Col>
                            </Row>
                        </ListGroup.Item>

                        {product.countInStock>0 && (
                            <ListGroup.Item>
                                <Row>
                                    <Col>Quantity</Col>
                                    <Col>
                                        <Form.Select as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                            {[...Array(product.countInStock).keys()].map(c => (
                                                <option key={c+1} value={c+1}>{c+1}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}

                        <ListGroup.Item>
                            <Button onClick={addtoCartHandler} type='button' className='btn btn-warning' disabled={product.countInStock===0}>Add to Cart</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        }
        </>
    )
}

export default ProductScreen