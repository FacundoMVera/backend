const express = require('express');
const router = express.Router();
const GestorArchivos = require('../utils/gestorArchivos');
const { v4: uuidv4 } = require('uuid');

const gestorCarritos = new GestorArchivos('./datos/carritos.json');


router.post('/', async (req, res) => {
  const carritos = await gestorCarritos.leerArchivo();
  const nuevoCarrito = { id: uuidv4(), products: [] };

  carritos.push(nuevoCarrito);
  await gestorCarritos.escribirArchivo(carritos);

  res.status(201).json(nuevoCarrito);
});

// Obtener productos de un carrito por su ID
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const carritos = await gestorCarritos.leerArchivo();
  const carrito = carritos.find((c) => c.id === cid);

  carrito
    ? res.json(carrito.products)
    : res.status(404).json({ error: 'Carrito no encontrado' });
});


router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const carritos = await gestorCarritos.leerArchivo();

  const carrito = carritos.find((c) => c.id === cid);
  if (!carrito) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const producto = carrito.products.find((p) => p.product === pid);

  if (producto) {
    producto.quantity += 1;
  } else {
    carrito.products.push({ product: pid, quantity: 1 });
  }

  await gestorCarritos.escribirArchivo(carritos);
  res.json(carrito);
});

module.exports = router;
