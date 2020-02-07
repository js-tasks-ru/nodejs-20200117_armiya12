const path = require('path');

const Koa = require('koa');
const app = new Koa();

const publicPath = path.join(__dirname, 'public');

app.use(require('koa-static')(publicPath));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = new Map();

app.use((ctx, next) => {
  ctx.req.on('close', function() {
    subscribers.delete(ctx.request.url);
  });
  return next();
});

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve) => {
    subscribers.set(ctx.request.url, resolve);
  });
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.status = 200;
    return;
  }
  subscribers.forEach((resolve) => {
    resolve(message);
    ctx.status = 200;
  });
});

app.use(router.routes());

module.exports = app;
