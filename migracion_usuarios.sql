-- ============================================================
-- MIGRACIÓN: Usuarios + Proyectos por usuario
-- Ejecutar sobre la BD existente "graficacion"
-- ============================================================
USE graficacion;

-- ──────────────────────────────────────────────────────────────
-- 1. Aseguramos que la tabla Participantes exista (registro/login)
--    Si ya existe, este bloque no hace nada gracias al IF NOT EXISTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Participantes (
    id_participante INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)  NOT NULL,
    email           VARCHAR(100)  UNIQUE NOT NULL,
    password_hash   VARCHAR(255)  NOT NULL,
    fecha_registro  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────
-- 2. Relacionamos cada Proyecto con su dueño (el participante
--    que lo creó).  Usamos ADD COLUMN IF NOT EXISTS para no
--    romper si ya corriste el script antes.
-- ──────────────────────────────────────────────────────────────
ALTER TABLE Proyectos
    ADD COLUMN IF NOT EXISTS id_participante INT NULL
        AFTER descripcion,
    ADD CONSTRAINT IF NOT EXISTS fk_proyectos_participante
        FOREIGN KEY (id_participante)
        REFERENCES Participantes(id_participante)
        ON DELETE SET NULL;

-- ──────────────────────────────────────────────────────────────
-- 3. Aseguramos que la tabla Proyecto_Participantes exista
--    (roles dentro del proyecto — colaboración futura)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Roles (
    id_rol      INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol  VARCHAR(50) NOT NULL UNIQUE
);

INSERT IGNORE INTO Roles (nombre_rol)
    VALUES ('Administrador'), ('Analista Lider'), ('Cliente');

CREATE TABLE IF NOT EXISTS Proyecto_Participantes (
    id_proyecto     INT NOT NULL,
    id_participante INT NOT NULL,
    id_rol          INT,
    PRIMARY KEY (id_proyecto, id_participante),
    FOREIGN KEY (id_proyecto)     REFERENCES Proyectos(id_proyecto)         ON DELETE CASCADE,
    FOREIGN KEY (id_participante) REFERENCES Participantes(id_participante)  ON DELETE CASCADE,
    FOREIGN KEY (id_rol)          REFERENCES Roles(id_rol)                   ON DELETE SET NULL
);

-- ──────────────────────────────────────────────────────────────
-- 4. Aseguramos el resto de tablas de análisis y salida
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Analisis_Requerimientos (
    id_analisis INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    tipo_metodo ENUM(
        'entrevista', 'cuestionario', 'historias_usuarios',
        'focus_group', 'observaciones', 'documentos',
        'seguimiento_transaccional'
    ) NOT NULL,
    contenido   JSON      NOT NULL,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id_proyecto) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Diagramas_Generados (
    id_diagrama     INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto     INT  NOT NULL,
    tipo_diagrama   VARCHAR(50)  NOT NULL,
    codigo_generado TEXT         NOT NULL,
    creado_en       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id_proyecto) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Prompts_Finales (
    id_prompt       INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto     INT  NOT NULL,
    contenido_prompt TEXT NOT NULL,
    creado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id_proyecto) ON DELETE CASCADE
);

-- ──────────────────────────────────────────────────────────────
-- FIN DEL SCRIPT
-- ──────────────────────────────────────────────────────────────
