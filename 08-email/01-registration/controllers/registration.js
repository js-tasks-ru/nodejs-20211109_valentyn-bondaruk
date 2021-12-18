const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const {email, displayName, password} = ctx.request.body;
  const createdUser = await User.create({email, displayName, verificationToken});
  await createdUser.setPassword(password);

  await sendMail({to: email, subject: 'confirmation', template: 'confirmation', verificationToken});

  ctx.user = createdUser;
  ctx.status = 200;
  ctx.body = {};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const currentUser = await User.findOne({verificationToken});

  currentUser.verificationToken = undefined;
  await currentUser.save();

  ctx.body = {token: verificationToken};

  if (!currentUser) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }
};
