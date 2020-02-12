
const Product = require('../models/Product');
const mapProduct = require('../mappers/mappers');

module.exports.productsByQuery = async (ctx, next) => {
  const query = ctx.request.query.query;
  const data = await Product.find({$text: {$search: query}}).sort();
  const result = data ? data.map(mapProduct) : [];
  ctx.body = {products: result};
};
