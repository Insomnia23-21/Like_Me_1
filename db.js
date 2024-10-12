import pg from 'pg';

// Configura la conexión a la base de datos
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'likeme',
  password: 'insomnia2321',
  port: 5432, 
});

// Función para probar la conexión (opcional, pero útil)
async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Conexión a la base de datos exitosa.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

// Exporta la conexión (pool)
export default pool;