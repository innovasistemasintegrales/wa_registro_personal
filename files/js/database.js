const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    database: 'db_registro_innova',
    user: 'root',
    password: '',
});

db.connect((err) =>{
    if (err) {
        console.error('Error al conectar la base de datos', err);
        throw err;        
    }
    console.log('Conexión a base de datos exitosa');
    
})


module.exports = db;