// src/controllers/productController.js
import productRepository from '../repositories/productRepository.js';

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const product = await productRepository.createProduct(req.body);
    res.status(201).json({ message: 'Producto creado', product });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al crear producto' });
  }
};

// Obtener todos los productos (con filtros/paginación opcional)
export const getProducts = async (req, res) => {
  try {
    const { limit, page, sort, category, title, minPrice, maxPrice } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (title) filter.title = new RegExp(title, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const options = { limit, page };
    if (sort) {
      const sortObj = {};
      sort.split(',').forEach(k => {
        if (k.startsWith('-')) sortObj[k.slice(1)] = -1;
        else sortObj[k] = 1;
      });
      options.sort = sortObj;
    }

    const products = await productRepository.getProducts(filter, options);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al obtener productos' });
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await productRepository.getProductById(req.params.id);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message || 'Producto no encontrado' });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const updated = await productRepository.updateProduct(req.params.id, req.body);
    res.json({ message: 'Producto actualizado', product: updated });
  } catch (error) {
    res.status(404).json({ error: error.message || 'Error al actualizar producto' });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await productRepository.deleteProduct(req.params.id);
    res.json({ message: 'Producto eliminado', product: deleted });
  } catch (error) {
    res.status(404).json({ error: error.message || 'Error al eliminar producto' });
  }
};
