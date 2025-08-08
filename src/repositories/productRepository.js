
import productDao from '../daos/productDao.js';

class ProductRepository {
  async getProducts(filter = {}, options = {}) {
    return await productDao.findAll(filter, options);
  }

  async getProductById(id) {
    const product = await productDao.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  async createProduct(data) {
   
    if (!data.title || !data.price || !data.code) {
      throw new Error('Faltan campos obligatorios: title, price, code');
    }
    return await productDao.create(data);
  }

  async updateProduct(id, data) {
    const updated = await productDao.updateById(id, data);
    if (!updated) {
      throw new Error('Producto no encontrado o no se pudo actualizar');
    }
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productDao.deleteById(id);
    if (!deleted) {
      throw new Error('Producto no encontrado o no se pudo eliminar');
    }
    return deleted;
  }

  // -------- Lógica de compra / stock --------
  async decreaseStock(productId, qty) {
    const updated = await productDao.decreaseStock(productId, qty);
    if (!updated) {
      throw new Error('Stock insuficiente o producto no encontrado');
    }
    return updated;
  }

  async decreaseStockBulk(items) {
    return await productDao.decreaseStockBulk(items);
  }
}

const productRepository = new ProductRepository();
export default productRepository;
