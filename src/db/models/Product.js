import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    suppliers: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    isDiscountActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: 'products' },
);

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
