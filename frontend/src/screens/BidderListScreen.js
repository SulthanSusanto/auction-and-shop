import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Loader.js'
import { biddersProduct, detailsProduct } from '../actions/productAction.js'
import expressAsyncHandler from 'express-async-handler'

const BidderListScreen = ({ history, match }) => {
  const productId = match.params.id
  const dispatch = useDispatch()

  const [qty, setQty] = useState(1)

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productBidders = useSelector((state) => state.productBidders)
  const {
    loading: loadingBidders,
    error: errorBidders,
    bidders,
  } = productBidders

  console.log(bidders)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const addToCartHandler = expressAsyncHandler(async () => {
    const priceArray = []
    const biddersId = []
    bidders.forEach((bidder) => {
      if (bidder.price) {
        priceArray.push(bidder.price)
        biddersId.push(bidder.bidder)
      }
    })
    const highestPriceBid = Math.max(...priceArray)

    let lastBidder = biddersId.slice(-1)
    lastBidder = lastBidder[0]

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-type': 'application/json',
      },
    }

    const updatedData = await axios.put(
      `/api/v1/product/price/${productId}`,
      { highestPriceBid },
      config
    )

    if (updatedData)
      history.push(`/cart/${match.params.id}/${lastBidder}?qty=${qty}`)
  })

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) history.push('/login')
    else {
      if (!bidders || !product || !product.name) {
        dispatch(biddersProduct(match.params.id))
        dispatch(detailsProduct(match.params.id))
      }
    }
  }, [dispatch, history, userInfo, match, bidders, product])

  return (
    <>
      <Link to={`/admin/productslist`} className='btn btn-light my-3'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <h1>
          {product.name} (${product.price})
        </h1>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>BID</th>
              <th>ADD TO CART</th>
            </tr>
          </thead>

          <tbody>
            {loadingBidders ? (
              <Loader />
            ) : errorBidders ? (
              <Message variant='danger'>{errorBidders}</Message>
            ) : (
              bidders
                .slice(0)
                .reverse()
                .map((bidder, index) => (
                  <tr key={bidder._id}>
                    <td>{bidder._id}</td>
                    <td>{bidder.name}</td>
                    <td>{bidder.price}</td>
                    <td>
                      {index === 0 && (
                        <Button
                          type='button'
                          variant='light'
                          className='btn-sm'
                          onClick={addToCartHandler}
                        >
                          Add To {bidder.name}'s cart
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default BidderListScreen
