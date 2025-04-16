import Cart from "../db/models/Cart.js";



// GET /api/cart
export const getCartItems = async (req, res,next) => {
  try {
    const cart = await Cart.findOne({ _id: req.userId }); // Получаем корзину пользователя
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart.items); // Возвращаем товары в корзине
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

// PUT /api/cart/update
export const updateCart = async (req, res,next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ _id: req.userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (productIndex !== -1) {
      cart.items[productIndex].quantity = quantity; // Обновляем количество товара в корзине
    } else {
      // Если товара нет в корзине, добавляем новый
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

// POST /api/cart/checkout
export const checkout = async (req, res,next) => {
  try {
    const cart = await Cart.findOne({ _id: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Пример оформления покупки
    const order = {
      userId: req.userId,
      items: cart.items,
      totalAmount: cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
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
