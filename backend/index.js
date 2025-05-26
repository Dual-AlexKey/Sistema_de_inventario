require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

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

app.get('/api/subcategorias/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM subcategorias WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Subcategoría no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});






// POST /api/login
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    // Compara la contraseña con la almacenada (suponiendo que está hasheada)
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT (puedes incluir datos que necesites)
    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        cargos_id: user.cargos_id,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




app.post('/api/register', async (req, res) => {
  try {
    const { nombre, correo, contrasena, cargos_id } = req.body;

    if (!nombre || !correo || !contrasena || !cargos_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Aquí normalmente haces hashing de contraseña:
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Guardar usuario en la base de datos:
    await pool.query('INSERT INTO usuario (nombre, correo, contrasena, cargos_id) VALUES (?, ?, ?, ?)', [
      nombre, correo, hashedPassword, cargos_id
    ]);

    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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





// Obtener todos los proveedores
app.get('/api/proveedores', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM proveedores');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un proveedor por id
app.get('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo proveedor
app.post('/api/proveedores', async (req, res) => {
  const { nombre, ruc, direccion, estado } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO proveedores (nombre, ruc, direccion, estado) VALUES (?, ?, ?, ?)`,
      [nombre, ruc, direccion, estado]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un proveedor
app.put('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, ruc, direccion, estado } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    await pool.query(
      `UPDATE proveedores SET nombre = ?, ruc = ?, direccion = ?, estado = ? WHERE id = ?`,
      [nombre, ruc, direccion, estado, id]
    );

    res.json({ message: 'Proveedor actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un proveedor
app.delete('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




















const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API corriendo en http://localhost:${port}`));


