import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'

// @desc    get all products
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
  if (products) res.json(products)
  else throw new Error('Products not found')
})

// @desc    get product by id
// @route   GET /api/v1/product/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)

  if (product) res.json(product)
  else throw new Error('Product not found')
})

// @desc    Delete a product
// @route   DELETE /api/v1/product/:id
// @access  private/admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed.' })
  } else throw new Error('Product not found')
})

// @desc    Create a product
// @route   POST /api/v1/product/
// @access  private/admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.png',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/v1/product/:id
// @access  private/admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    isAuction,
    isOpen,
  } = req.body

  if (product) {
    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.isAuction = isAuction
    product.isOpen = isOpen

    const updatedProduct = await product.save()

    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Update a product's price
// @route   PUT /api/v1/product/price/:id
// @access  private/admin
export const updateProductPrice = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  const { highestPriceBid } = req.body

  if (product) {
    product.price = highestPriceBid || product.price

    const updatedProduct = await product.save()

    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    bidder make a bid
// @route   POST /api/v1/product/:id/auction
// @access  private
export const createBidderProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  const { price, winner } = req.body

  if (product) {
    const newbidder = {
      bidder: req.user._id,
      name: req.user.name,
      price: Number(price),
      winner,
    }

    product.bidders.push(newbidder)

    await product.save()
    res.status(201).json(product.bidders)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    bidder make a bid
// @route   POST /api/v1/product/:id/auction
// @access  private
export const getBidders = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  const { bidders } = product

  res.json(bidders)
})
