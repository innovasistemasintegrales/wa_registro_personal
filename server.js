/* import { getStorage } from 'firebase/storage' */
const express = require('express');
const cors = require('cors');
const db = require('./files/js/database');
const fs = require('node:fs');
const multer = require('multer');

const app = express();
const port = 3000;

const upload = multer({ dest: './files/pages/archivos/'});

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

  const newPath = `./files/pages/archivos/${req.body.dni + req.file.originalname}`;
  fs.renameSync(req.file.path, newPath);

  /* Creamos la nueva ruta de imagen para guardar en DB */
  const dbFilePath = `archivos/${req.body.dni + req.file.originalname}`;

  let query = `INSERT INTO personas (dni, nombres, telefono, grado_instruccion, institucion, descripcion, cv, fecha_registro, rol, usuario, contrasena) 
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
    const failure = true;
    const duplicate = true;
    if (err) {
      if (failure) {
        if (err.code == 'ER_DUP_ENTRY') {
          res.json({ status: 'duplicate', message: 'Ya se encuntra registrado' });
        }else{
          res.json({ status: 'failure', message: 'Error al guardar datos' });
          console.error('Error al insertar los datos:', err);
        }
      }
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

