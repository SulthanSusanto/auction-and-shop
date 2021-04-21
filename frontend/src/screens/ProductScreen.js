import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Table,
} from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import {
  detailsProduct,
  createProductBidder,
  biddersProduct,
} from '../actions/productAction'
import Rating from '../components/Rating'
import { PRODUCT_BIDDERS_RESET } from '../constants/productConstant'

const ProductScreen = ({ history, match }) => {
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productBidders = useSelector((state) => state.productBidders)
  const {
    loading: loadingBidders,
    error: errorBidders,
    bidders,
  } = productBidders

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productBidderCreate = useSelector((state) => state.productBidderCreate)
  const { success: successCreate } = productBidderCreate

  const [qty, setQty] = useState(1)

  const dispatch = useDispatch()

  useEffect(() => {
    if (successCreate) dispatch({ type: PRODUCT_BIDDERS_RESET })
    dispatch(biddersProduct(match.params.id))
    dispatch(detailsProduct(match.params.id))
  }, [dispatch, match, successCreate])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}/${userInfo._id}?qty=${qty}`)
  }

  const bidHandler = () => {
    if (bidders.length !== 0) {
      const lastBid = bidders.slice(-1)
      const { price } = lastBid[0]
      const priceBid = price + 10

      const newBidder = {
        bidder: userInfo._id,
        name: userInfo.name,
        price: priceBid,
      }
      dispatch(createProductBidder(match.params.id, newBidder))
    } else {
      const firstBid = product.price
      const priceBid = firstBid + 10

      const newBidder = {
        bidder: userInfo._id,
        name: userInfo.name,
        price: priceBid,
      }
      dispatch(createProductBidder(match.params.id, newBidder))
    }
  }

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : !product.isAuction ? (
        <Row>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.image} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? 'Count in stock.'
                            : 'Out of stock.'}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                      <i className='fas fa-cart-plus'></i> Add to cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Row>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.image} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Bid:</strong>
                      </Col>
                      <Col>
                        <strong>
                          {product.bidders.length === 0 ? (
                            product.price + 10
                          ) : loadingBidders ? (
                            <Loader />
                          ) : (
                            bidders.slice(-1).map((bidder) => bidder.price + 10)
                          )}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? 'Count in stock.'
                            : 'Out of stock.'}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                      onClick={bidHandler}
                      className='btn-block'
                      type='button'
                      disabled={!userInfo || !product.isOpen}
                    >
                      <i className='fa fa-gavel' aria-hidden='true'></i> bid
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <h2 className='mt-3'>Bidders</h2>

          {product.bidders.length === 0 && <Message>No bidder</Message>}
          {loadingBidders ? (
            <Loader />
          ) : errorBidders ? (
            <Message variant='danger'>{errorBidders}</Message>
          ) : (
            <Table striped bordered hover responsive size='sm'>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {bidders
                  .slice(0)
                  .reverse()
                  .map((bidder, index) => {
                    return (
                      <tr key={bidder._id}>
                        <td>{bidder.name}</td>
                        <td>${bidder.price}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
          )}
        </>
      )}
    </>
  )
}

export default ProductScreen
