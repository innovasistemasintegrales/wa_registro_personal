// Your web app's Firebase configuration
/* import { getStorage } from 'firebase/storage' */
const express = require('express');
const cors = require('cors');
const db = require('./database');
const fs = require('node:fs');
const multer = require('multer');

const app = express();
const port = 3000;

const upload = multer({ dest: '../archivos/' });

app.use(cors());
app.use(express.json());



// Middleware para analizar el cuerpo de las solicitudes
/* app.use(bodyParser.json()); */

app.get('/listar', (req, res) =>{
  db.query('SELECT * FROM personas',(err, results) =>{
    if (err) {
      res.status(500).send('Error en la base de datos');
      return;
    }
    res.json(results);
    
  });
});

app.post('/registrar', upload.single('file'), (req, res) =>{

  const {dni, nombres, celular, grado, institucion, descripcion, rol} = req.body;

  // Validar si se cargó un archivo
  if (!req.file) {
    return res.status(400).send('Error: No se cargó ningún archivo.');
  }

  const newPath = `../archivos/${req.body.dni + req.file.originalname}`;
  fs.renameSync(req.file.path, newPath);

  /* Creamos la nueva ruta de imagen para guardar en DB */
  const dbFilePath = `/files/archivos/${req.body.dni + req.file.originalname}`;

  let query = `INSERT INTO Personas (DNI, Nombres, Telefono, Grado_instruccion, Institucion, Descripcion, CV, Fecha_registro, Rol, Usuario, Contrasena) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  let values = [
    dni,
    nombres,
    celular,
    grado,
    institucion,
    descripcion,
    dbFilePath,
    new Date(),
    rol,
    null,
    null
  ]
  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    const success = true;
    if (err) {
      console.error('Error al insertar los datos:', err);
      return;
    }
    if (success) {
      res.json({ status: 'success', message: 'Datos guardados exitosamente' });
    }
    console.log('Datos insertados correctamente:', result);
  });
  // Cerrar la conexión después de completar las operaciones
  /* db.end((err) => {
    if (err) {
      console.error('Error al cerrar la conexión:', err);
      return;
    }
    console.log('Conexión cerrada');
  }); */
})

app.listen(port, () =>{
  console.log(`Servidor escuchando en: ${port}`);
})

