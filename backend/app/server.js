import express from 'express'
import path from 'path'
import multer from 'multer'
import {
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  getBidders,
  createBidderProduct,
  updateProductPrice,
} from '../routes/productRoutes.js'
import {
  userAuth,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../routes/userRoutes.js'
import { admin, protect } from '../middleware/authMiddleware.js'
import {
  addOrderItems,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../routes/orderRoutes.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

// upload
router.post('/upload', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

// product
router.post('/product', protect, admin, createProduct)
router.get('/products', getAllProducts)
router
  .route('/product/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct)
router.put('/product/price/:id', protect, admin, updateProductPrice)

// upload
router.post('/upload', upload.single('image'), (req, res) =>
  res.send(`/${req.file.path}`)
)

// auction
router
  .route('/auction/:id/')
  .get(protect, getBidders)
  .post(protect, createBidderProduct)

// user
router.get('/users', protect, admin, getAllUsers)
router.post('/user/login', userAuth)
router.post('/user/register', registerUser)
router
  .route('/user/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/user/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)

// order
router.post('/order', protect, addOrderItems)
router.get('/orders', protect, admin, getAllOrders)
router.get('/order/myorders', protect, getMyOrders)
router.get('/order/:id', protect, getOrderById)
router.put('/order/:id/pay', protect, updateOrderToPaid)
router.put('/order/:id/deliver', protect, admin, updateOrderToDelivered)

export default router
