drop database inventario_tailoy
CREATE DATABASE inventario_tailoy ;

USE inventario_tailoy;

-- Tabla: cargos
CREATE TABLE cargos (
   id INT PRIMARY KEY AUTO_INCREMENT,
   nombre VARCHAR(50) NOT NULL
);

-- Tabla: usuario
CREATE TABLE usuario (
   id INT PRIMARY KEY AUTO_INCREMENT,
   nombre VARCHAR(40) NOT NULL,
   correo VARCHAR(100) NOT NULL,
   contrasena TEXT NOT NULL,
   cargos_id INT NOT NULL,
   CONSTRAINT fk_cargos_usuario FOREIGN KEY (cargos_id) REFERENCES cargos(id)
);


INSERT INTO cargos (nombre) VALUES
('Admin'),
('Usuario'),
('Supervisor');


select *from cargos
-- Tabla: categorias
CREATE TABLE categorias (
   id INT PRIMARY KEY AUTO_INCREMENT,
   nombre VARCHAR(40) NOT NULL
);

-- Tabla: subcategorias
CREATE TABLE subcategorias (
   id INT PRIMARY KEY AUTO_INCREMENT,
   nombre VARCHAR(40) NOT NULL,
   categorias_id INT NOT NULL,
   CONSTRAINT fk_categoria_subcategoria FOREIGN KEY (categorias_id) REFERENCES categorias(id)
);

-- Tabla: productos
CREATE TABLE productos (
   id INT PRIMARY KEY AUTO_INCREMENT,
   codigo INT NOT NULL UNIQUE,
   nombre VARCHAR(40) NOT NULL,
   marca VARCHAR(50),
   descripcion Text NOT NULL,
   subcategorias_id INT NOT NULL,
   stock INT NOT NULL,
   precio_unitario DECIMAL(10, 2) NOT NULL,
   unidad_medida VARCHAR(50) NOT NULL,
   estado BIT NOT NULL,
   CONSTRAINT fk_subcategoria_producto FOREIGN KEY (subcategorias_id) REFERENCES subcategorias(id)
);

-- Tabla: proveedores
CREATE TABLE proveedores (
   id INT PRIMARY KEY AUTO_INCREMENT,
   nombre VARCHAR(40) NOT NULL,
   ruc VARCHAR(40) NOT NULL,
   telefono VARCHAR(40) NOT NULL,
   direccion text NOT NULL,
   estado BIT
);

-- Tabla: orden_compra
CREATE TABLE orden_compra (
   id INT PRIMARY KEY AUTO_INCREMENT,
   proveedores_id INT NOT NULL,
   fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   usuario_id INT NOT NULL,
   estado_operacion INT NOT NULL,
   CONSTRAINT fk_proveedores FOREIGN KEY (proveedores_id) REFERENCES proveedores(id),
   CONSTRAINT fk_usuario_orden_compra FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabla: orden_compra_productos
CREATE TABLE orden_compra_productos (
   id INT PRIMARY KEY AUTO_INCREMENT,
   orden_compra_id INT NOT NULL,
   productos_id INT NOT NULL,
   cantidad INT NOT NULL,
   precio_unitario DECIMAL(10,2) NOT NULL,
   observaciones VARCHAR(255),
   CONSTRAINT fk_orden_compra_productos FOREIGN KEY (orden_compra_id) REFERENCES orden_compra(id),
   CONSTRAINT fk_productos_oc FOREIGN KEY (productos_id) REFERENCES productos(id)
);

-- Tabla: sucursales
CREATE TABLE sucursales (
   id INT PRIMARY KEY AUTO_INCREMENT,
   nombre VARCHAR(50) NOT NULL
);

-- Tabla: despacho_sucursal
CREATE TABLE despacho_sucursal (
   id INT PRIMARY KEY AUTO_INCREMENT,
   usuario_id INT NOT NULL,
   estado_operacion INT NOT NULL,
   fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   sucursal_id INT NOT NULL,
   CONSTRAINT fk_usuario_despacho FOREIGN KEY (usuario_id) REFERENCES usuario(id),
   CONSTRAINT fk_sucursal_despacho FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

-- Tabla: despacho_sucursal_productos
CREATE TABLE despacho_sucursal_productos (
   id INT PRIMARY KEY AUTO_INCREMENT,
   despacho_sucursal_id INT NOT NULL,
   producto_id INT NOT NULL,
   cantidad INT NOT NULL,
   precio_unitario DECIMAL(10,2) NOT NULL,
   observaciones VARCHAR(255),
   CONSTRAINT fk_despacho_producto FOREIGN KEY (despacho_sucursal_id) REFERENCES despacho_sucursal(id),
   CONSTRAINT fk_producto_despacho FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Crear un índice único para asegurar la unicidad de despacho_sucursal_id y producto_id
CREATE UNIQUE INDEX idx_despacho_producto_unico ON despacho_sucursal_productos (despacho_sucursal_id, producto_id);

-- Tabla: movimientos_almacen
CREATE TABLE movimientos_almacen (
   id INT PRIMARY KEY AUTO_INCREMENT,
   tipo_almacen int NOT NULL,
   cantidad INT NOT NULL
);

-- Tabla: movimientos_almacen_productos
CREATE TABLE movimientos_almacen_productos (
   id INT PRIMARY KEY AUTO_INCREMENT,
   movimiento_almacen_id INT NOT NULL,
   producto_id INT NOT NULL,
   CONSTRAINT fk_movimiento_almacen_producto FOREIGN KEY (movimiento_almacen_id) REFERENCES movimientos_almacen(id),
   CONSTRAINT fk_producto_movimiento_almacen FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla: historial_acciones
CREATE TABLE historial_acciones (
   id INT PRIMARY KEY AUTO_INCREMENT,
   usuario_id INT NOT NULL,
   tipo_accion_id INT NOT NULL,
   fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   tipo_movimiento VARCHAR(50) NOT NULL,
   descripcion VARCHAR(255),
   modulo INT NOT NULL,
   CONSTRAINT fk_historial_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabla: movimientos_inventario
CREATE TABLE movimientos_inventario (
   id INT PRIMARY KEY AUTO_INCREMENT,
   producto_id INT NOT NULL,
   cantidad INT NOT NULL,
   nombre VARCHAR(50) NOT NULL,
   tipo_movimiento INT NOT NULL,
   fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   usuario_id INT NOT NULL,
   CONSTRAINT fk_producto_movimiento FOREIGN KEY (producto_id) REFERENCES productos(id),
   CONSTRAINT fk_usuario_movimiento FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
