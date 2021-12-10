const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const searchQuery = ctx.query.query;

  const products = await Product.find( {$text: {
    $search: searchQuery,
  }});

  ctx.body = {products: products.map((category) => mapProduct(category))};
};
