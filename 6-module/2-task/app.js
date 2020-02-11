const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');

const app = new Koa();

app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

function validationObjectId(ctx, next) {
  const params = ctx.request.path.replace('/api/products/', '');
  const isValid = mongoose.isValidObjectId(params);
  if (isValid) {
    ctx.request.params = params;
    return next();
  }
  ctx.throw(400, 'Invalid ObjectId');
};

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', validationObjectId, productById);

app.use(router.routes());

module.exports = app;
