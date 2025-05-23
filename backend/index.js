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
