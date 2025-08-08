
import Product from '../models/product.model.js';

class ProductDao {
  
  async findAll(filter = {}, options = {}) {
    const { limit = 50, page = 1, sort } = options;
    const query = Product.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    if (sort) query.sort(sort);
    return await query.exec();
  }

  async count(filter = {}) {
    return await Product.countDocuments(filter);
  }

  async findById(id) {
    return await Product.findById(id);
  }

  async create(data) {
    return await Product.create(data);
  }

  async updateById(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Product.findByIdAndDelete(id);
  }

  // ------- utilidades para la compra / stock -------

  // Disminuir stock de un producto (con chequeo)
  async decreaseStock(productId, qty) {
    // Solo decrementa si hay stock suficiente
    return await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true }
    );
  }

  // Decremento en bloque: [{ productId, qty }, ...]
  async decreaseStockBulk(items) {
    const results = [];
    for (const it of items) {
      const updated = await this.decreaseStock(it.productId, it.qty);
      results.push({ productId: it.productId, ok: !!updated });
    }
    return results;
  }
}

const productDao = new ProductDao();
export default productDao;
