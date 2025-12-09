/**
 * Script para inicializar usuarios de prueba
 * Ejecutar con: node scripts/init-users.js
 * Requiere: MongoDB corriendo y variables de entorno configuradas
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function initUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdeskpro');
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existen usuarios
    const existingClient = await User.findOne({ email: 'cliente@test.com' });
    const existingAgent = await User.findOne({ email: 'agente@test.com' });

    if (existingClient) {
      console.log('⚠️  Usuario cliente ya existe');
    } else {
      const hashedPasswordClient = await bcrypt.hash('123456', 10);
      await User.create({
        name: 'Cliente Prueba',
        email: 'cliente@test.com',
        password: hashedPasswordClient,
        role: 'client',
      });
      console.log('✅ Usuario cliente creado: cliente@test.com / 123456');
    }

    if (existingAgent) {
      console.log('⚠️  Usuario agente ya existe');
    } else {
      const hashedPasswordAgent = await bcrypt.hash('123456', 10);
      await User.create({
        name: 'Agente Prueba',
        email: 'agente@test.com',
        password: hashedPasswordAgent,
        role: 'agent',
      });
      console.log('✅ Usuario agente creado: agente@test.com / 123456');
    }

    console.log('\n📋 Credenciales de prueba:');
    console.log('Cliente: cliente@test.com / 123456');
    console.log('Agente: agente@test.com / 123456\n');

    await mongoose.connection.close();
    console.log('✅ Proceso completado');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

initUsers();


