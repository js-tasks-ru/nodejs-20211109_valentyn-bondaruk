const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const {email, displayName, password} = ctx.request.body;
  const createdUser = await User.create({email, displayName, verificationToken});
  await createdUser.setPassword(password);
  await createdUser.save();

  await sendMail({
    to: email,
    subject: 'Подтвердите почту',
    locals: {token: verificationToken},
    template: 'confirmation',
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const currentUser = await User.findOne({verificationToken});

  if (!currentUser) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }

  currentUser.set('verificationToken', undefined);
  await currentUser.save();

  ctx.body = {token: verificationToken};
};
