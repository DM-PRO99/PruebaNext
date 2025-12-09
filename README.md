# HelpDeskPro - Sistema de Gestión de Tickets

Sistema completo de gestión de tickets de soporte técnico desarrollado con Next.js, TypeScript, MongoDB y Mongoose. Permite a los clientes crear tickets de soporte y a los agentes gestionarlos de manera eficiente.

## 📋 Descripción General

HelpDeskPro es una aplicación web interna que digitaliza y optimiza la gestión de tickets de soporte, resolviendo problemas como:
- Falta de registro centralizado de tickets
- Pérdida de correos o respuestas tardías
- Ausencia de seguimiento claro del estado de cada ticket
- Falta de priorización y recordatorios para agentes
- Imposibilidad de medir tiempos de respuesta y estados globales

## 🚀 Tecnologías Utilizadas

- **Frontend:**
  - Next.js 16.0.8 (App Router)
  - React 19.2.1
  - TypeScript 5
  - Tailwind CSS 4
  - Context API para gestión de estado

- **Backend:**
  - Next.js API Routes
  - MongoDB con Mongoose
  - JWT para autenticación
  - bcryptjs para hash de contraseñas

- **Servicios:**
  - Axios para peticiones HTTP
  - Nodemailer para envío de correos
  - node-cron para tareas programadas

## ✨ Funcionalidades Principales

### 3.1 Gestión de Tickets
- ✅ Crear nuevos tickets desde el panel de cliente
- ✅ Editar/actualizar estado, prioridad y agente asignado desde el panel de agente
- ✅ Cerrar tickets cambiando su estado a "closed"
- ✅ Listar tickets con filtros:
  - Clientes: solo sus propios tickets
  - Agentes: todos los tickets con filtros por estado y prioridad
- ✅ Formularios controlados y tipados en TypeScript

### 3.2 Autenticación y Roles
- ✅ Módulo de login con validación de credenciales
- ✅ Dos roles: `client` y `agent`
- ✅ Redirección automática según rol después del login
- ✅ Protección de rutas basada en roles
- ✅ Context API para gestión de estado de autenticación

### 3.3 Comentarios y Respuestas
- ✅ Sistema de comentarios por ticket
- ✅ Clientes pueden agregar comentarios a sus tickets
- ✅ Agentes pueden responder tickets con comentarios
- ✅ Visualización cronológica de comentarios

### 3.4 Componentes UI Reutilizables
- ✅ **Button**: Variantes (primary, secondary, danger, outline) y tamaños (sm, md, lg)
- ✅ **Badge**: Para estados y prioridades con colores diferenciados
- ✅ **Card**: Para mostrar resumen de tickets con badges y botones integrados

### 3.5 API y Servicios
- ✅ Modelos Mongoose: User, Ticket, Comment
- ✅ API Routes completas:
  - `/api/auth/login` - Autenticación
  - `/api/auth/register` - Registro de usuarios
  - `/api/auth/me` - Obtener usuario actual
  - `/api/tickets` - CRUD de tickets
  - `/api/tickets/[id]` - Operaciones específicas de ticket
  - `/api/comments` - Gestión de comentarios
- ✅ Servicios Axios tipados para consumo de APIs
- ✅ Dashboard de agente con estadísticas y filtros

### 3.6 Notificaciones por Correo
- ✅ Envío automático de correos cuando:
  - Se crea un ticket (al cliente)
  - Un agente responde un ticket (al cliente)
  - Un ticket se cierra (al cliente)

### 3.7 Cron Jobs
- ✅ Endpoint `/api/cron/reminders` para detectar tickets sin respuesta
- ✅ Envía recordatorios a agentes sobre tickets pendientes (24+ horas sin actualizar)

### 3.8 Manejo de Errores y Validaciones
- ✅ Try/catch en servicios Axios y rutas API
- ✅ Mensajes de error y éxito claros al usuario
- ✅ Validaciones:
  - Título y descripción obligatorios
  - No permitir crear tickets sin autenticación
  - Respeto de roles en cada operación

## 📦 Requisitos Previos

- Node.js 18+ 
- MongoDB (local o MongoDB Atlas)
- Cuenta de email para envío de correos (Gmail, SendGrid, etc.)

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/DM-PRO99/PruebaNext.git
cd PruebaNext/pruebanext
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/helpdeskpro
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/helpdeskpro

# JWT Secret (cambiar en producción)
JWT_SECRET=tu-secret-jwt-super-seguro-cambiar-en-produccion

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
EMAIL_FROM=HelpDeskPro <noreply@helpdeskpro.com>

# Cron Secret (para proteger endpoint de cron)
CRON_SECRET=tu-secret-cron
```

**Nota para Gmail:**
- Necesitas generar una "App Password" en tu cuenta de Google
- Ve a: Google Account → Security → 2-Step Verification → App passwords

### 4. Inicializar Base de Datos

Asegúrate de que MongoDB esté corriendo. Luego, puedes crear usuarios de prueba ejecutando:

```bash
# Opción 1: Usar MongoDB Compass o mongo shell
# Opción 2: Usar el script de inicialización (ver sección siguiente)
```

### 5. Ejecutar el Proyecto

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 👥 Crear Usuarios de Prueba

Puedes crear usuarios de prueba usando la API de registro o directamente en MongoDB:

### Opción 1: Usando la API (desde Postman o curl)

```bash
# Crear cliente
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente Prueba",
    "email": "cliente@test.com",
    "password": "123456",
    "role": "client"
  }'

# Crear agente
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agente Prueba",
    "email": "agente@test.com",
    "password": "123456",
    "role": "agent"
  }'
```

### Opción 2: Script de Inicialización

Crear un archivo `scripts/init-users.ts` (opcional):

```typescript
// Ejecutar con: npx ts-node scripts/init-users.ts
```

## 🎯 Flujo de Uso

### Para Clientes:

1. **Login**: Acceder con credenciales de cliente
2. **Crear Ticket**: Desde el dashboard, hacer clic en "Crear Nuevo Ticket"
3. **Ver Tickets**: Lista de todos sus tickets con estado y prioridad
4. **Ver Detalle**: Hacer clic en "Ver Detalle" para ver y agregar comentarios
5. **Recibir Notificaciones**: Correos automáticos cuando el agente responde o cierra el ticket

### Para Agentes:

1. **Login**: Acceder con credenciales de agente
2. **Dashboard**: Ver estadísticas y todos los tickets
3. **Filtrar**: Usar filtros por estado y prioridad
4. **Gestionar Tickets**: 
   - Ver detalle del ticket
   - Cambiar estado (abierto → en progreso → resuelto → cerrado)
   - Cambiar prioridad
   - Responder con comentarios
5. **Recordatorios**: Recibir correos automáticos sobre tickets sin respuesta

## 📁 Estructura del Proyecto

```
pruebanext/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Rutas de autenticación
│   │   │   ├── tickets/        # Rutas de tickets
│   │   │   ├── comments/       # Rutas de comentarios
│   │   │   └── cron/          # Cron jobs
│   │   ├── client/            # Panel de cliente
│   │   │   ├── dashboard/
│   │   │   └── tickets/[id]/
│   │   ├── agent/             # Panel de agente
│   │   │   ├── dashboard/
│   │   │   └── tickets/[id]/
│   │   ├── login/             # Página de login
│   │   ├── layout.tsx         # Layout principal con AuthProvider
│   │   └── page.tsx           # Página principal (redirección)
│   ├── components/
│   │   ├── ui/                # Componentes reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Card.tsx
│   │   └── CreateTicketModal.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx    # Context de autenticación
│   ├── lib/
│   │   ├── mongodb.ts         # Conexión a MongoDB
│   │   ├── auth.ts            # Utilidades de autenticación
│   │   └── email.ts           # Servicio de correo
│   ├── models/
│   │   ├── User.ts            # Modelo de usuario
│   │   ├── Ticket.ts          # Modelo de ticket
│   │   └── Comment.ts         # Modelo de comentario
│   ├── services/
│   │   └── api.ts              # Servicios Axios
│   └── types/
│       └── index.ts           # Tipos TypeScript
├── .env.local                  # Variables de entorno (no commitear)
├── .env.local.example          # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## 🔐 Seguridad

- Contraseñas hasheadas con bcryptjs
- Autenticación JWT con expiración de 7 días
- Protección de rutas basada en roles
- Validación de datos en servidor
- Sanitización de inputs

## 📧 Configuración de Correos

El sistema envía correos automáticos en estos eventos:
- **Creación de ticket**: Al cliente que creó el ticket
- **Respuesta de agente**: Al cliente cuando un agente comenta
- **Cierre de ticket**: Al cliente cuando el ticket se cierra
- **Recordatorios**: A agentes sobre tickets sin respuesta (cron job)

## ⏰ Cron Jobs

El endpoint `/api/cron/reminders` debe ser llamado periódicamente (cada hora o diariamente) por un servicio de cron externo como:
- Vercel Cron
- cron-job.org
- GitHub Actions
- Servidor propio con node-cron

**Ejemplo de configuración en Vercel:**

```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 * * * *"
  }]
}
```

## 🧪 Testing

Para probar el sistema:

1. Crear un usuario cliente y un usuario agente
2. Iniciar sesión como cliente y crear un ticket
3. Iniciar sesión como agente y gestionar el ticket
4. Verificar que se reciben los correos de notificación

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que MongoDB esté corriendo
- Verificar la URI en `.env.local`
- Para MongoDB Atlas, verificar la IP whitelist

### Error al enviar correos
- Verificar credenciales de email en `.env.local`
- Para Gmail, usar App Password, no la contraseña normal
- Verificar que el puerto 587 no esté bloqueado

### Error de autenticación
- Verificar que JWT_SECRET esté configurado
- Limpiar localStorage del navegador
- Verificar que el token no haya expirado

## 📸 Capturas de Pantalla

### Flujo Principal:

1. **Login**: Página de inicio de sesión
2. **Dashboard Cliente**: Lista de tickets del cliente con opción de crear nuevos
3. **Crear Ticket**: Modal para crear nuevo ticket con título, descripción y prioridad
4. **Detalle Ticket Cliente**: Vista detallada con comentarios y opción de agregar más
5. **Dashboard Agente**: Estadísticas, filtros y lista de todos los tickets
6. **Gestionar Ticket Agente**: Vista detallada con opciones de cambiar estado, prioridad y responder

## 📝 Datos del Coder

- **Nombre**: [Tu Nombre]
- **Clan**: [Tu Clan]
- **Correo**: [Tu Correo]
- **Documento de Identidad**: [Tu Documento]

## 📄 Licencia

Este proyecto fue desarrollado como prueba de desempeño.

## 🙏 Agradecimientos

- Next.js por el framework
- MongoDB por la base de datos
- Tailwind CSS por los estilos

---

**Desarrollado con ❤️ usando Next.js y TypeScript**
