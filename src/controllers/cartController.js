import CartCollection from '../db/models/Cart.js';

// GET /api/cart
export const getCartItems = async (req, res, next) => {
  try {
    const cart = await CartCollection.findOne({ _id: req.userId }).populate('items.productId'); // Получаем корзину пользователя
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart.items); // Возвращаем товары в корзине
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

// PUT /api/cart/update
export const updateCart = async (req, res, next) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;
  try {
    let cart = await CartCollection.findOne({ _id: userId });

    if (!cart) {
      cart = await CartCollection.create({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
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


export const deleteFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await CartCollection.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
