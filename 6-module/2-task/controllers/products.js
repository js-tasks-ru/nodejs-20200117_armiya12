const Product = require('../models/Product.js');
const { mapProduct } = require('../mappers/mappers');

module.exports.productsBySubcategory = async (ctx, next) => {
  const subcategory = ctx.request.query.subcategory;
  const params = subcategory ? { subcategory: subcategory } : null;

  if (!params) {
    return next();
  }
  const data = await Product.find(params);
  ctx.body = {
    products: data.map(mapProduct),
  };
};

module.exports.productList = async (ctx, next) => {
  const data = await Product.find();
  ctx.body = {
    products: data.map(mapProduct),
  };
};

module.exports.productById = async (ctx, next) => {
  const productId = ctx.request.params;
  const data = await Product.findById(productId);
  if (!data) {
    ctx.throw(404, 'Product Not Found');
  }
  ctx.body = {
    product: mapProduct(data),
  };
};