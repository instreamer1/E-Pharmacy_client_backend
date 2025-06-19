import CartCollection from '../db/models/Cart.js';

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
  try {
    const cart = await CartCollection.findOne({ _id: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Пример оформления покупки
    const order = {
      userId: req.userId,
      items: cart.items,
      totalAmount: cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
      status: 'Pending', // Статус заказа
      date: new Date(),
    };

    // Сохранение заказа в базе данных (например, в коллекции orders)
    // В этом примере заказ просто выводится
    console.log(order);

    // Очистка корзины после оформления
    cart.items = [];
    await cart.save();

    res.status(201).json(order); // Возвращаем заказ
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};
