const express = require('express');
const router = express.Router();
const GestorArchivos = require('../utils/gestorArchivos');
const { v4: uuidv4 } = require('uuid');
const Producto = require('../modelos/producto.model');  // Asegúrate de que la ruta es correcta


const gestorProductos = new GestorArchivos('./datos/productos.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
  const { limit } = req.query;
  const productos = await gestorProductos.leerArchivo();

  res.json(limit ? productos.slice(0, Number(limit)) : productos);
});

// Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const productos = await gestorProductos.leerArchivo();
  const producto = productos.find((p) => p.id === pid);

  producto
    ? res.json(producto)
    : res.status(404).json({ error: 'Producto no encontrado' });
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({
      error: 'Todos los campos son obligatorios, excepto thumbnails',
    });
  }

  const productos = await gestorProductos.leerArchivo();
  const nuevoProducto = new Producto(title, description, code, price, true, stock, category, thumbnails);

  nuevoProducto.id = uuidv4();
  productos.push(nuevoProducto);

  await gestorProductos.escribirArchivo(productos);
  res.status(201).json(nuevoProducto);
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const actualizaciones = req.body;

  const productos = await gestorProductos.leerArchivo();
  const indice = productos.findIndex((p) => p.id === pid);

  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  productos[indice] = { ...productos[indice], ...actualizaciones, id: pid };
  await gestorProductos.escribirArchivo(productos);

  res.json(productos[indice]);
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const productos = await gestorProductos.leerArchivo();
  const nuevosProductos = productos.filter((p) => p.id !== pid);

  if (productos.length === nuevosProductos.length) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  await gestorProductos.escribirArchivo(nuevosProductos);
  res.status(204).send();
});

module.exports = router;
