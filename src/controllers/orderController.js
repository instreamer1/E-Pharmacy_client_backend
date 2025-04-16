import Order from "../db/models/Order.js";


// GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId }); // Получаем все заказы для пользователя
    res.json(orders);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount } = req.body;
    const order = new Order({
      userId: req.userId,
      items,
      totalAmount,
      status: 'Pending',
      date: new Date(),
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};
