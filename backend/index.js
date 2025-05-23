require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Endpoint prueba
app.get('/', (req, res) => {
  res.send('API Inventario funcionando');
});

// CRUD Productos

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Obtener un producto por id
app.get('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Actualizar un producto por id
app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, subcategorias_id, stock, precio_unitario, unidad_medida, estado } = req.body;

  try {
    // Verificar si el producto existe
    const [existing] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar el producto
    await pool.query(
      `UPDATE productos SET nombre = ?, subcategorias_id = ?, stock = ?, precio_unitario = ?, unidad_medida = ?, estado = ? WHERE id = ?`,
      [nombre, subcategorias_id, stock, precio_unitario, unidad_medida, estado, id]
    );

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Obtener todas las categorías
app.get('/api/categorias', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener subcategorías por categoría
app.get('/api/subcategorias/:categoriaId', async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const [rows] = await pool.query('SELECT * FROM subcategorias WHERE categorias_id = ?', [categoriaId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



















// Crear un producto
app.post('/api/productos', async (req, res) => {
  const { nombre, subcategorias_id, stock, precio_unitario, unidad_medida, estado } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO productos (nombre, subcategorias_id, stock, precio_unitario, unidad_medida, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, subcategorias_id, stock, precio_unitario, unidad_medida, estado]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API corriendo en http://localhost:${port}`));
