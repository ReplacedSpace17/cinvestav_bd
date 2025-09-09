-- =========================
-- TABLA USUARIOS
-- =========================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_p VARCHAR(100) NOT NULL,
    apellido_m VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL
);

-- =========================
-- TABLA ANALISIS (FORMULARIOS)
-- =========================
CREATE TABLE analisis (
    id_analisis INT AUTO_INCREMENT PRIMARY KEY,
    type_form ENUM('genomica','16s','16s_articulo','18s','metagenomas','its') NOT NULL,
    fecha DATE,
    id_usuario INT NOT NULL,
    link_auxiliar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- =========================
-- TABLA SITIOS
-- =========================
CREATE TABLE sitios (
    id_sitio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- =========================
-- TABLA SITIOS_ESPECIFICOS
-- =========================
CREATE TABLE sitios_especificos (
    id_sitio_especifico INT AUTO_INCREMENT PRIMARY KEY,
    id_sitio INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_sitio) REFERENCES sitios(id_sitio)
);

-- =========================
-- TABLA MUESTRAS
-- =========================
CREATE TABLE muestras (
    id_muestra INT AUTO_INCREMENT PRIMARY KEY,
    id_analisis INT NOT NULL,
    codigo_muestra VARCHAR(100),           -- id_muestra escrito por el usuario
    genero VARCHAR(255),
    numero_cepario_gob TEXT,
    tipo_muestra VARCHAR(255),
    caracteristicas TEXT,
    id_sitio INT,
    id_sitio_especifico INT,
    profundidad VARCHAR(50),
    estrategia_muestreo VARCHAR(255),
    nombre_cepa VARCHAR(255),
    FOREIGN KEY (id_analisis) REFERENCES analisis(id_analisis),
    FOREIGN KEY (id_sitio) REFERENCES sitios(id_sitio),
    FOREIGN KEY (id_sitio_especifico) REFERENCES sitios_especificos(id_sitio_especifico)
);

-- =========================
-- TABLA SECUENCIAS
-- =========================
CREATE TABLE secuencias (
    id_secuencia INT AUTO_INCREMENT PRIMARY KEY,
    id_muestra INT NOT NULL,
    tipo_analisis VARCHAR(255),            -- Solo para formularios que lo usan
    metodo_extraccion VARCHAR(255),
    plataforma VARCHAR(255),
    lugar_secuenciacion VARCHAR(255),
    tratamiento VARCHAR(255),
    fenotipo1 VARCHAR(255),
    fenotipo2 VARCHAR(255),
    fenotipo3 VARCHAR(255),
    secuencia TEXT,
    longitud_secuencia INT,
    link_datos_crudos TEXT,
    link_secuencias_ensambladas TEXT,
    FOREIGN KEY (id_muestra) REFERENCES muestras(id_muestra)
);

-- =========================
-- TABLA ADMINISTRATIVOS
-- =========================
CREATE TABLE administrativos (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    id_analisis INT NOT NULL,
    software_pipeline VARCHAR(255),
    publicaciones TEXT,
    notas TEXT,
    FOREIGN KEY (id_analisis) REFERENCES analisis(id_analisis)
);

-- =========================
-- TABLA IDENTIFICADORES_EXTERNOS
-- =========================
CREATE TABLE identificadores_externos (
    id_ext INT AUTO_INCREMENT PRIMARY KEY,
    id_analisis INT NOT NULL,
    bioproject VARCHAR(255),
    biosample VARCHAR(255),
    sra VARCHAR(255),
    ncbi_assembly VARCHAR(255),
    accession VARCHAR(255),
    genomas TEXT,
    taxonomias TEXT,
    FOREIGN KEY (id_analisis) REFERENCES analisis(id_analisis)
);

-- =========================
-- TABLA ENLACES
-- =========================
CREATE TABLE enlaces (
    id_enlace INT AUTO_INCREMENT PRIMARY KEY,
    id_analisis INT NOT NULL,
    tipo ENUM('imagen_cepa_pura','imagen_muestreo','ufc','detalle','datos_crudos','secuencias_ensambladas') NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (id_analisis) REFERENCES analisis(id_analisis)
);
