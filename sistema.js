const express= require ('express')//se asigna una constante e importamos la biblioteca
const sqlite3=require ('sqlite3'). verbose();//verbose se utiliza para obtener mensajes detallados de despuracion
const app=express();//se crea una instancia de la aplicacion express,la instancia se utiliza para configurar y manejar la aplicacion web
const PORT=3000;
const db=new sqlite3.Database('proyectos.db');//conexion a la base de datos
//ejecutamos una consulta sqlite3 para crear la tabla si no existe entonces define la estructura
db.run(`
  CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    fecha DATE,
    usuario TEXT,
    notas TEXT,
    foto TEXT
  )
`);
app.use(express.json());
app.get('/proyectos', (req, res) => {
    const { estado } = req.query;
    let query = 'SELECT * FROM proyectos';
  
    if (estado && (estado !== 'pendiente' && estado !== 'en progreso' && estado !== 'completado')) {
      return res.status(400).send('El parámetro estado es inválido');
    }
  
    if (estado) {
      query += ` WHERE estado = '${estado}'`;
    }
  
    db.all(query, (err, proyectos) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
      } else {
        res.json(proyectos);
      }
    });
  });
  
  // Agregar un nuevo proyecto
  app.post('/proyectos', (req, res) => {
    const { nombre, fecha, usuario, notas, estado, foto } = req.body;
  
    if (!nombre || !fecha || !usuario || !estado) {
      return res.status(400).send('Se requieren nombre, fecha, usuario y estado para agregar un proyecto');
    }
  
    db.run(
      'INSERT INTO proyectos (nombre, fecha, usuario, notas, estado, foto) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, fecha, usuario, notas, estado, foto],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al agregar un proyecto');
        } else {
          res.send('Proyecto agregado correctamente');
        }
      }
    );
  });
  
  // Actualizar un proyecto existente por su ID
  app.put('/proyectos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, fecha, usuario, notas, estado, foto } = req.body;
  
    if (!nombre && !fecha && !usuario && !notas && !estado && !foto) {
      return res.status(400).send('Se requiere al menos un campo para actualizar');
    }
  
    const updateFields = [];
    const values = [];
  
    if (nombre) {
      updateFields.push('nombre = ?');
      values.push(nombre);
    }
  
    if (fecha) {
      updateFields.push('fecha = ?');
      values.push(fecha);
    }
  
    // Agregar los demás campos aquí de manera similar...
  
    values.push(id);
  
    db.run(
      `UPDATE proyectos SET ${updateFields.join(', ')} WHERE id = ?`,
      values,
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al actualizar el proyecto');
        } else {
          res.send('Proyecto actualizado correctamente');
        }
      }
    );
  });
  
  // Eliminar un proyecto por su ID
  app.delete('/proyectos/:id', (req, res) => {
    const { id } = req.params;
  
    db.run('DELETE FROM proyectos WHERE id = ?', id, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el proyecto');
      } else {
        res.send('Proyecto eliminado correctamente');
      }
    });
});   
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${port}`);
  });
                                                                                                                                                                                                                                            
