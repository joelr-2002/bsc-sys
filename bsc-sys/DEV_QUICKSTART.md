# Scripts de Inicio Rápido - BSC Scorecard

## 🚀 Iniciar Proyecto

### Windows (PowerShell)

```powershell
# Ejecutar ambos servidores en terminales separadas

# Terminal 1: Laravel
cd "D:\code\javascript\BSC SYS\bsc-sys"
php artisan serve

# Terminal 2: Vite
cd "D:\code\javascript\BSC SYS\bsc-sys"
npm run dev
```

### Linux/Mac

```bash
# Terminal 1: Laravel
cd ~/BSC\ SYS/bsc-sys
php artisan serve

# Terminal 2: Vite
cd ~/BSC\ SYS/bsc-sys
npm run dev
```

### Usando Concurrently (Recomendado)

Agregar script en `package.json`:

```json
{
  "scripts": {
    "dev:all": "concurrently \"php artisan serve\" \"npm run dev\" --names \"Laravel,Vite\" --prefix-colors \"blue,green\""
  }
}
```

Luego ejecutar:

```bash
npm run dev:all
```

---

## 🌐 URLs

- **Frontend (Vite)**: http://localhost:5173
- **Backend (Laravel)**: http://localhost:8000
- **Demo Ant Design**: http://localhost:8000/antd-demo

---

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Iniciar servidores
npm run dev              # Vite frontend
php artisan serve        # Laravel backend

# Queue worker (para ETL)
php artisan queue:work

# Verificaciones
npm run types:check      # TypeScript
npm run lint             # ESLint
npm run format           # Prettier
```

### Base de Datos

```bash
# Migraciones
php artisan migrate              # Ejecutar migraciones
php artisan migrate:fresh        # Limpiar y recrear
php artisan migrate:fresh --seed # Con datos de prueba

# Seeders
php artisan db:seed              # Ejecutar seeders
```

### Build

```bash
# Producción
npm run build            # Build de frontend
php artisan config:cache # Cache de configuración
php artisan route:cache  # Cache de rutas
php artisan view:cache   # Cache de vistas

# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Testing

```bash
# PHPUnit (Laravel)
php artisan test                 # Todos los tests
php artisan test --filter=KPI    # Tests específicos

# Vitest (React)
npm run test                     # Tests unitarios
npm run test:watch               # Watch mode
```

---

## 🔧 Troubleshooting

### Puerto ocupado

Si el puerto 8000 está ocupado:

```bash
php artisan serve --port=8080
```

### Problemas con Vite

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Permisos en storage/

```bash
# Linux/Mac
chmod -R 775 storage bootstrap/cache

# Windows (ejecutar como admin)
icacls storage /grant Everyone:(OI)(CI)F /T
```

---

## 📦 Instalación Inicial

Si es la primera vez:

```bash
# 1. Clonar/descargar proyecto
cd "D:\code\javascript\BSC SYS\bsc-sys"

# 2. Instalar dependencias
composer install
npm install

# 3. Configurar .env
cp .env.example .env
php artisan key:generate

# 4. Base de datos (SQLite)
touch database/database.sqlite
php artisan migrate

# 5. Iniciar
npm run dev:all
```

---

## 🎯 Atajos Rápidos

```bash
# Alias para PowerShell (agregar a $PROFILE)
function bsc-dev { cd "D:\code\javascript\BSC SYS\bsc-sys"; npm run dev:all }
function bsc-test { cd "D:\code\javascript\BSC SYS\bsc-sys"; php artisan test && npm run test }

# Alias para Bash (agregar a ~/.bashrc o ~/.zshrc)
alias bsc-dev='cd ~/BSC\ SYS/bsc-sys && npm run dev:all'
alias bsc-test='cd ~/BSC\ SYS/bsc-sys && php artisan test && npm run test'
```

Uso:

```bash
bsc-dev     # Iniciar proyecto completo
bsc-test    # Ejecutar todos los tests
```
