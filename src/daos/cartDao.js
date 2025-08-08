
import Cart from '../models/cart.model.js';

class CartDao {
  create() {
    return Cart.create({ products: [] });
  }

  getById(id) {
    return Cart.findById(id).populate('products.product');
  }

  save(cart) {
    return cart.save();
  }

  async empty(cartId) {
    return Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true }).populate('products.product');
  }
}

export default new CartDao();
