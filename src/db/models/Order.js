import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  photo: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: {
    type: [orderItemSchema],
    validate: [(val) => val.length > 0, 'Order must have at least one item'],
  },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['Cash On Delivery', 'Bank'],
    required: true,
  },
  shippingInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;
