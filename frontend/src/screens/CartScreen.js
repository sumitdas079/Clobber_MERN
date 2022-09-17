import React, { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Card, Button, ListGroup, Image, Form, Alert } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeCart } from '../actions/cartActions'

const CartScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()
  const dispatch = useDispatch()
  const { cartItems } = useSelector((state) => state.cart)

  //const qty = searchParams.get("qty") || 1
  console.log(cartItems);
  const qty = search ? Number(search.split('=')[1]) : 1

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty))
    }
  }, [dispatch, id, qty])

  const removefromCart = (id) => {
    dispatch(removeCart(id))
    console.log('removed');
  }

  const checkOutHandler = () => {
    if(!cartItems)
    {
      navigate('/login')
    }else{
      navigate('/shipping')
    }
    console.log('checkout');
  }
  return (
    <Row>
      <Col md={8}>
        <h1>YOUR CART</h1>
        {
          cartItems.length === 0 ? (
            <Message>Your cart is empty<Alert.Link to='/'>Go back</Alert.Link></Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map(item => (
                <ListGroup.Item>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>{item.price}</Col>
                    <Col md={2}>
                      <Form.Select as='select' value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                        {[...Array(item.countInStock).keys()].map(c => (
                          <option key={c + 1} value={c + 1}>{c + 1}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Button type='button' className='btn btn-danger' onClick={() => removefromCart(item.product)}><i className="fa-sharp fa-solid fa-trash"></i></Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )
        }
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Subtotal {cartItems.reduce((acc, curr) => acc + curr.qty, 0)} item(s)</h2>
              <h6>&#8377;{cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0).toFixed(2)}</h6>
            </ListGroup.Item>

            <ListGroup.Item>
              <Button type='button' className='btn btn-block btn-secondary' disabled={cartItems.length === 0} onClick={checkOutHandler}>Proceed to Checkout</Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen