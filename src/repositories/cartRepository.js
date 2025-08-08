
import cartDao from '../daos/cartDao.js';
import productDao from '../daos/productDao.js';

class CartRepository {
  async createCart() {
    return cartDao.create();
  }

  async getCart(cartId) {
    return cartDao.getById(cartId);
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await cartDao.getById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const product = await productDao.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const idx = cart.products.findIndex(p => p.product._id.toString() === productId);
    if (idx >= 0) {
      cart.products[idx].quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity });
    }
    await cartDao.save(cart);
    return cart;
  }

  async updateQuantity(cartId, productId, quantity) {
    const cart = await cartDao.getById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const idx = cart.products.findIndex(p => p.product._id.toString() === productId);
    if (idx === -1) throw new Error('Producto no está en el carrito');

    cart.products[idx].quantity = quantity;
    await cartDao.save(cart);
    return cart;
  }

  async removeProduct(cartId, productId) {
    const cart = await cartDao.getById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
    await cartDao.save(cart);
    return cart;
  }

  async empty(cartId) {
    return cartDao.empty(cartId);
  }
}

export default new CartRepository();
