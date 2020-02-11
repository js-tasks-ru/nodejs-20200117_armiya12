const Category = require('../models/Category');
const { mapCategory } = require('../mappers/mappers');

module.exports.categoryList = async function categoryList(ctx, next) {
  const data = await Category.find();
  ctx.body = { categories: data.map(mapCategory) };
};
