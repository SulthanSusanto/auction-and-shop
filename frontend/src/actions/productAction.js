import axios from 'axios'

import {
  PRODUCT_CREATE_BIDDER_FAIL,
  PRODUCT_CREATE_BIDDER_REQUEST,
  PRODUCT_CREATE_BIDDER_SUCCESS,
  PRODUCT_LIST_PROCESS,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_PROCESS,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_BIDDERS_REQUEST,
  PRODUCT_BIDDERS_SUCCESS,
  PRODUCT_BIDDERS_FAIL,
} from '../constants/productConstant'

export const listProduct = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_PROCESS })
    const { data } = await axios.get('/api/v1/products')
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const detailsProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_PROCESS })
    const { data } = await axios.get(`/api/v1/product/${id}`)
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/v1/product/${id}`, config)

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: message,
    })
  }
}

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-type': 'application/json',
      },
    }

    const { data } = await axios.post(`/api/v1/product`, {}, config)

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: message,
    })
  }
}

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-type': 'application/json',
      },
    }

    const { data } = await axios.put(
      `/api/v1/product/${product._id}`,
      product,
      config
    )

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: message,
    })
  }
}

export const createProductBidder = (productId, bidder) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_BIDDER_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()
    console.log(userInfo)

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-type': 'application/json',
      },
    }

    await axios.post(`/api/v1/auction/${productId}`, bidder, config)

    dispatch({
      type: PRODUCT_CREATE_BIDDER_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    dispatch({
      type: PRODUCT_CREATE_BIDDER_FAIL,
      payload: message,
    })
  }
}

export const biddersProduct = (productId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_BIDDERS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()
    console.log(userInfo)

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-type': 'application/json',
      },
    }

    const { data } = await axios.get(`/api/v1/auction/${productId}`, config)

    dispatch({
      type: PRODUCT_BIDDERS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    dispatch({
      type: PRODUCT_BIDDERS_FAIL,
      payload: message,
    })
  }
}
