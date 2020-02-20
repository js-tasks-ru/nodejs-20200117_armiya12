const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  if (!ctx.user) ctx.throw(401, 'Пользователь не залогинен');
  const messages = await Message.find({ user: ctx.user.displayName }).select('date text id user').limit(20).exec();
  ctx.body = { messages: messages.map(mapMessage) };
};
