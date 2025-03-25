# Configuración de Variables de Entorno en Netlify

Este documento proporciona instrucciones detalladas para configurar las variables de entorno necesarias para el proyecto Luna en Netlify.

## Variables de Entorno Requeridas

Deberás configurar las siguientes variables de entorno en el panel de control de Netlify:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://username:password@cluster.mongodb.net/luna` |
| `MONGODB_DB_NAME` | Nombre de la base de datos | `luna` |
| `JWT_SECRET` | Clave secreta para tokens JWT | `tu_clave_secreta_muy_larga_y_compleja` |
| `JWT_EXPIRES_IN` | Tiempo de expiración de tokens | `7d` |
| `ANTHROPIC_API_KEY` | Clave API de Anthropic para Claude | `sk-ant-api03-...` |
| `KOFI_VERIFICATION_TOKEN` | Token de verificación de Ko-fi | `tu_token_de_kofi` |

## Pasos para Configurar Variables de Entorno en Netlify

1. Inicia sesión en tu cuenta de [Netlify](https://app.netlify.com/)

2. Selecciona tu sitio de Luna en el dashboard

3. Ve a **Site settings** (Configuración del sitio)

4. En el menú lateral, selecciona **Environment variables** (Variables de entorno)

5. Haz clic en **Add a variable** (Añadir una variable)

6. Para cada variable en la tabla anterior:
   - Introduce el nombre de la variable exactamente como aparece en la columna "Variable"
   - Introduce el valor correspondiente
   - Haz clic en **Save** (Guardar)

7. Una vez configuradas todas las variables, ve a la pestaña **Deploys** (Despliegues)

8. Haz clic en **Trigger deploy** (Activar despliegue) y selecciona **Clear cache and deploy site** (Limpiar caché y desplegar sitio)

## Obtención de los Valores

### MongoDB Atlas URI

1. Inicia sesión en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Selecciona tu cluster
3. Haz clic en **Connect** (Conectar)
4. Selecciona **Connect your application** (Conectar tu aplicación)
5. Copia el URI de conexión y reemplaza `<password>` con tu contraseña

### Anthropic API Key

1. Inicia sesión en [Anthropic Console](https://console.anthropic.com/)
2. Ve a **API Keys** (Claves API)
3. Crea una nueva clave API o usa una existente
4. Copia la clave API (comienza con `sk-ant-api...`)

### Ko-fi Verification Token

1. Inicia sesión en tu cuenta de [Ko-fi](https://ko-fi.com/)
2. Ve a **Settings** (Configuración)
3. Selecciona **API** en el menú lateral
4. Copia el token de verificación

## Verificación

Para verificar que las variables de entorno están configuradas correctamente:

1. Después de desplegar, ve a **Functions** en el panel de Netlify
2. Verifica que las funciones `get-audit-logs` y `create-audit-log` aparezcan como **Active**
3. Si hay errores, revisa los logs de las funciones para identificar problemas con las variables de entorno

## Notas de Seguridad

- Nunca compartas tus claves API o tokens de verificación
- No incluyas estos valores en el código fuente
- Considera usar diferentes claves API para entornos de desarrollo y producción
- Revisa periódicamente y rota tus claves API por seguridad
