import React, { useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Table, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { PRODUCT_CREATE_RESET } from '../constants/productConstant'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'


const ProductListScreen = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    //const { id } = useParams()

    const productList = useSelector((state) => state.productList)
    const { loading, error, products } = productList

    const productCreate = useSelector((state) => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

    const productDelete = useSelector((state) => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin


    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })
        if (!userInfo.isAdmin) {
            navigate('/login')
        }
        if(successCreate){
            navigate(`/admin/products/${createdProduct._id}/edit`)
        }else{
            dispatch(listProducts())
        }

    }, [dispatch, navigate, userInfo, createdProduct, successCreate, successDelete])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => {
        dispatch(createProduct())
    }

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>PRODUCTS</h1>

                    <Col className='text-right'>
                        <Button className='my-3' variant='success' onClick={createProductHandler}>
                            <i class="fa-solid fa-plus"></i> Create Product
                        </Button>
                    </Col>
                </Col>
            </Row>
            {loadingDelete && <Loader/>}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader/>}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>&#8377; {product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/products/${product._id}/edit`} className='mx-3'>
                                            <Button variant='info' className='btn-sm'>
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                            <i class="fa-solid fa-trash-can"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </>
    )
}

export default ProductListScreen