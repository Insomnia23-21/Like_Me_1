import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db';

const app = express();
app.use(cors());
app.use(express.json()); 

const port = 3000;

app.get('/posts', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM posts'); 
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ error: 'Error al obtener posts' });
  }
});

app.post('/posts', async (req, res) => {
  const { titulo, url, descripcion } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, url, descripcion, 0] 
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al crear un nuevo post:', error);
    res.status(500).json({ error: 'Error al crear un nuevo post' });
  }
});

app.put('/posts/like/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const { rows } = await db.query( 
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [postId]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al dar like al post:', error);
    res.status(500).json({ error: 'Error al dar like al post' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    await db.query('DELETE FROM posts WHERE id = $1', [postId]); 
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el post:', error);
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); 
});

app.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});