const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapProduct = require('../mappers/product');
const mapOrder = require('../mappers/order');

module.exports.checkout = async (ctx, next) => {
    const { user } = ctx;
    if (!user) ctx.throw(401);

    const {
        product,
        phone,
        address
    } = ctx.request.body;

    const productById = await Product.findById(product);
    const order = await Order.create({
        user,
        product: productById,
        phone,
        address
    });
    const mappedProduct = mapProduct(order.product);

    await sendMail({
        to: user.email,
        subject: 'Подтверждение заказа',
        locals: {
            id: order.id,
            product: {
                title: mappedProduct.title
            },
        },
        template: 'order-confirmation',
    });

    ctx.body = { order: order.id };
};

module.exports.getOrdersList = async (ctx, next) => {
    const { user } = ctx;
    const orders = await Order.find({ user }).populate('product');
    ctx.body = {
        orders: orders.map(mapOrder),
    };
};
