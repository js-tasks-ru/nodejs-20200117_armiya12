const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  if (!ctx.user) ctx.throw(401, 'Not authorized');
  const messages = await Message.find({ user: ctx.user.displayName }).select('date text id user').limit(20).exec();
  ctx.body = { messages };
};
