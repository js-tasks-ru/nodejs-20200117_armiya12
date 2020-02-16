const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const token = uuid();
    const {
        email,
        displayName,
        password,
    } = ctx.request.body;

    try {
        const user = new User({
            email,
            displayName,
            verificationToken: token,
        });

        await user.setPassword(password);
        await user.save();

        await sendMail({
            template: 'confirmation',
            locals: { token },
            to: email,
            subject: 'Подтвердите почту',
        });

        ctx.body = { status: 'ok' };

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = error.errors;
            const response = { errors: {} };

            for (const err in errors) {
                if (errors[err]) {
                    const message = errors[err].message;
                    response.errors[err] = message;
                }
            }
            ctx.status = 400;
            ctx.body = response;
        }
    }
};

module.exports.confirm = async (ctx, next) => {
    const verificationToken = ctx.request.body;
    const user = await User.findOneAndUpdate(verificationToken, { $unset: verificationToken });

    if (!user) {
      ctx.status = 400;
      ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
      return;
    }

    const resUser = await User.findOne({ email: user.email });
    const token = await ctx.login(resUser);

    ctx.body = { token };
};
