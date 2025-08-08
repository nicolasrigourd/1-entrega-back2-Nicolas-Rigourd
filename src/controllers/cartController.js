// src/controllers/cartController.js
import cartRepo from '../repositories/cartRepository.js';
import { User } from '../models/User.js';

export const createOrGetMyCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.cart) {
      const cart = await cartRepo.getCart(user.cart);
      return res.json({ cart });
    }

    const cart = await cartRepo.createCart();
    user.cart = cart._id;
    await user.save();

    res.status(201).json({ message: 'Carrito creado', cart });
  } catch (e) {
    res.status(500).json({ error: 'Error al crear/obtener carrito', details: e.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartRepo.getCart(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ cart });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener carrito', details: e.message });
  }
};

export const addProductToMyCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.cart) return res.status(400).json({ error: 'El usuario no tiene carrito. Crealo primero.' });

    const { pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await cartRepo.addProduct(user.cart.toString(), pid, Number(quantity));
    res.status(200).json({ message: 'Producto agregado', cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const updateQuantityInMyCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.cart) return res.status(400).json({ error: 'El usuario no tiene carrito.' });

    const { pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ error: 'Cantidad inválida' });

    const cart = await cartRepo.updateQuantity(user.cart.toString(), pid, Number(quantity));
    res.json({ message: 'Cantidad actualizada', cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const removeProductFromMyCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.cart) return res.status(400).json({ error: 'El usuario no tiene carrito.' });

    const { pid } = req.params;
    const cart = await cartRepo.removeProduct(user.cart.toString(), pid);
    res.json({ message: 'Producto removido', cart });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const emptyMyCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.cart) return res.status(400).json({ error: 'El usuario no tiene carrito.' });

    const cart = await cartRepo.empty(user.cart.toString());
    res.json({ message: 'Carrito vaciado', cart });
  } catch (e) {
    res.status(500).json({ error: 'Error al vaciar carrito', details: e.message });
  }
};
