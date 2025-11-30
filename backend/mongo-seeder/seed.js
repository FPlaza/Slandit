// ./mongo-seeder/seed.js
const { MongoClient } = require('mongodb');

// URLs de conexión (inyectadas por docker-compose)
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

// IDs que deben coincidir con tu init.sql de Postgres
const TEST_USER_ID = '3f6c1e5c-9c60-4b1a-9f5b-1b1a1b1a1b1a';
const ADMIN_USER_ID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

async function runSeed() {
  const client = new MongoClient(uri);
  console.log('🌱 Conectando al seeder de MongoDB...');

  try {
    await client.connect();
    console.log('✅ Conectado exitosamente a MongoDB.');
    const db = client.db(dbName);

    // Limpiar colecciones (opcional, para idempotencia)
    await db.collection('profiles').deleteMany({});
    await db.collection('subforums').deleteMany({});
    await db.collection('posts').deleteMany({});
    
    // Crear Perfiles de Usuario
    const profiles = [
      {
        _id: TEST_USER_ID, // Vinculado a Postgres
        username: 'testuser',
        bio: 'Solo soy un usuario de prueba.',
        avatarUrl: null,
        karma: 0,
        currency: 50,
        createdAt: new Date()
      },
      {
        _id: ADMIN_USER_ID, // Vinculado a Postgres
        username: 'adminuser',
        bio: 'Soy el admin.',
        avatarUrl: null,
        karma: 100,
        currency: 1000,
        createdAt: new Date()
      }
    ];
    await db.collection('profiles').insertMany(profiles);
    console.log('Insertados perfiles de prueba.');

    // Crear un Subforo
    const subforumResult = await db.collection('subforums').insertOne({
      name: 'programacion',
      displayName: 'Programación',
      description: 'Un lugar para hablar de código.',
      administrator: ADMIN_USER_ID, // Vinculado al admin
      memberCount: 2,
      createdAt: new Date()
    });
    const subforumId = subforumResult.insertedId;
    console.log('Insertado subforo de prueba.');

    // Crear una Publicación 
    await db.collection('posts').insertOne({
      title: '¡Hola Mundo!',
      content: 'Esta es la primera publicación en el foro de prueba.',
      authorId: TEST_USER_ID,
      subforumId: subforumId,
      voteScore: 1,
      upvotedBy: [TEST_USER_ID],
      downvotedBy: [],
      commentCount: 0,
      createdAt: new Date()
    });
    console.log('Insertada publicación de prueba.');

    console.log('🎉 ¡Siembra de datos completada exitosamente!');

  } catch (err) {
    console.error('Error durante la siembra de datos:', err.stack);
  } finally {
    // Asegurarse de cerrar la conexión
    await client.close();
    console.log('Conexión de MongoDB cerrada.');
  }
}

runSeed();