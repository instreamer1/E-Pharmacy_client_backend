import CartCollection from '../db/models/Cart.js';
import OrderCollection from '../db/models/Order.js';
import ProductCollection from '../db/models/Product.js';

// GET /api/cart
export const getCartItems = async (req, res, next) => {
  try {
    const cart = await CartCollection.findOne({ userId: req.userId }).populate(
      'items.productId',
    );

    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json({ items: cart.items });
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/update
export const updateCart = async (req, res, next) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await CartCollection.findOne({ userId });

    if (!cart) {
      if (quantity > 0) {
        cart = await CartCollection.create({
          userId,
          items: [{ productId, quantity }],
        });
      } else {
        return res.status(200).json({ items: [] });
      }
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex !== -1) {
        if (quantity === 0) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = quantity;
        }
      } else if (quantity > 0) {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    // Populate product details before sending to client
    const populatedCart = await cart.populate('items.productId');

    res.status(200).json(populatedCart);
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/checkout
export const checkout = async (req, res, next) => {
  const userId = req.userId;
  const { items, shippingInfo, paymentMethod } = req.body;
  const clientTotal = Number(req.body.total);

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

   
    const productIds = items.map((i) => i.productId);
    const products = await ProductCollection.find({ _id: { $in: productIds } });


    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      const price = product.price;
      totalAmount += price * item.quantity;

      return {
        productId: product._id,
        name: product.name,
        photo: product.photo,
        price,
        quantity: item.quantity,
      };
    });

    totalAmount = Number(totalAmount.toFixed(2));
    if (clientTotal !== totalAmount) {
     return res.status(409).json({
    message: 'Price mismatch detected. Please refresh your cart and try again.',
    code: 'PRICE_MISMATCH',
    serverTotal: totalAmount,
  });
    }

    const order = new OrderCollection({
      userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingInfo,
      status: 'Pending',
      date: new Date(),
    });
    await order.save();


    const cart = await CartCollection.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};
