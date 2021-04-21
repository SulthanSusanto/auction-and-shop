import {
  PRODUCT_LIST_PROCESS,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_PROCESS,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_RESET,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CREATE_BIDDER_REQUEST,
  PRODUCT_CREATE_BIDDER_SUCCESS,
  PRODUCT_CREATE_BIDDER_FAIL,
  PRODUCT_CREATE_BIDDER_RESET,
  PRODUCT_DETAILS_RESET,
  PRODUCT_BIDDERS_REQUEST,
  PRODUCT_BIDDERS_SUCCESS,
  PRODUCT_BIDDERS_FAIL,
  PRODUCT_BIDDERS_RESET,
} from '../constants/productConstant'

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_PROCESS:
      return { loading: true, products: [] }
    case PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload }
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productDetailsReducer = (
  state = { product: { reviews: [], bidders: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_PROCESS:
      return { loading: true, ...state }
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload }
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true }
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true }
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload }
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true }
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload }
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_UPDATE_RESET:
      return { product: {} }
    default:
      return state
  }
}

export const productBidderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_BIDDER_REQUEST:
      return { loading: true }
    case PRODUCT_CREATE_BIDDER_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_CREATE_BIDDER_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_CREATE_BIDDER_RESET:
      return {}
    default:
      return state
  }
}

export const productBiddersReducer = (state = { bidders: [] }, action) => {
  switch (action.type) {
    case PRODUCT_BIDDERS_REQUEST:
      return { loading: true, ...state }
    case PRODUCT_BIDDERS_SUCCESS:
      return { loading: false, bidders: action.payload }
    case PRODUCT_BIDDERS_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_BIDDERS_RESET:
      return {}
    default:
      return state
  }
}
