import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartAction'

const CartScreen = ({ match, history, location }) => {
  const productId = match.params.idProduct
  const userId = match.params.idUser

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart
  console.log(cartItems)

  const myCartItems = []
  cartItems.forEach((item) => {
    if (item.userId === userInfo._id) myCartItems.push(item)
  })
  console.log(myCartItems)

  const dispatch = useDispatch()

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  useEffect(() => {
    if (!userInfo._id) history.push('/login')
    if (productId && userInfo && userId)
      dispatch(addToCart(productId, qty, userId))
  }, [dispatch, productId, userId, userInfo, qty, history])

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ fontSize: '1.8rem', padding: '1rem 0' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => {
              if (item.userId === userInfo._id)
                return (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image
                          src={item.image}
                          alt={item.image}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col md={2}>{item.name}</Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={2}>
                        <Form.Control
                          as='select'
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(
                                item.product,
                                Number(e.target.value),
                                userInfo._id
                              )
                            )
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type='button'
                          variant='light'
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )
            })}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2 style={{ fontSize: '1.4rem', padding: '0.5rem 0' }}>
                Subtotal ({myCartItems.reduce((acc, item) => acc + item.qty, 0)}
                ) items
              </h2>
              $
              {myCartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={myCartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
