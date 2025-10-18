# 🎮 Unity Web Build Responsive Converter

Este proyecto automatiza la conversión de compilados de Unity WebGL para que sean completamente responsive y optimizados para orientación portrait con resolución 2400x1080.

## 📋 Características

- ✅ **Responsive**: Se adapta automáticamente a cualquier tamaño de pantalla
- ✅ **Portrait**: Optimizado específicamente para orientación vertical
- ✅ **Resolución fija**: Mantiene la proporción 1080x2400 en todos los dispositivos
- ✅ **Sin elementos desktop**: Elimina footer, botón de pantalla completa y otros elementos innecesarios
- ✅ **Fondo blanco**: Fondo limpio para mejor contraste visual
- ✅ **Centrado automático**: El canvas se centra perfectamente en cualquier pantalla
- ✅ **Backup automático**: Crea copias de seguridad de los archivos originales

## 🚀 Uso Rápido

### Requisitos

- Node.js instalado en tu sistema
- Un compilado de Unity WebGL

### Pasos

1. **Descarga el script**:

   ```bash
   # Copia el archivo make-responsive.js a tu directorio de trabajo
   ```

2. **Ejecuta el script**:

   ```bash
   # Desde el directorio donde está tu compilado de Unity
   node make-responsive.js .

   # O especifica la ruta completa
   node make-responsive.js /ruta/a/tu/compilado
   ```

3. **¡Listo!** Tu compilado ahora es responsive

## 📁 Estructura de Archivos Requeridos

El script espera encontrar esta estructura en tu compilado de Unity:

```
tu-compilado/
├── index.html                    # Archivo principal (será modificado)
├── TemplateData/
│   ├── style.css                 # Estilos (será modificado)
│   ├── favicon.ico
│   ├── unity-logo-light.png
│   ├── progress-bar-empty-light.png
│   └── progress-bar-full-light.png
├── Build/
│   ├── Travesia_Web.loader.js
│   ├── Travesia_Web.data
│   ├── Travesia_Web.framework.js
│   └── Travesia_Web.wasm
└── StreamingAssets/
    └── (tus archivos de assets)
```

## ⚙️ Configuración

Puedes modificar la configuración en el archivo `make-responsive.js`:

```javascript
const CONFIG = {
  targetResolution: {
    width: 1080, // Ancho del canvas
    height: 2400, // Alto del canvas
  },
  gameTitle: "La Gran Travesia Constitucional", // Título del juego
  companyName: "NolimStudios", // Nombre de la empresa
  productName: "La_Gran_Travesia_Constitucional", // Nombre del producto
  productVersion: "1.0", // Versión
};
```

## 🔧 Cambios Realizados

### En `index.html`:

- ✅ Canvas redimensionado a 1080x2400
- ✅ Meta viewport agregado para dispositivos móviles
- ✅ Footer y elementos desktop eliminados
- ✅ Función de escalado responsive implementada
- ✅ Centrado automático del canvas

### En `TemplateData/style.css`:

- ✅ Fondo blanco para mejor contraste
- ✅ Contenedor fijo que ocupa toda la pantalla
- ✅ Flexbox para centrado perfecto
- ✅ Canvas responsive con `object-fit: contain`
- ✅ Estilos optimizados para portrait

## 📱 Compatibilidad

El compilado responsive funciona en:

- 📱 **Móviles**: iPhone, Android (todas las resoluciones)
- 📱 **Tablets**: iPad, Android tablets
- 💻 **Desktop**: Cualquier resolución de pantalla
- 🌐 **Navegadores**: Chrome, Firefox, Safari, Edge

## 🛡️ Seguridad

- ✅ **Backup automático**: Los archivos originales se guardan en `backup/`
- ✅ **Verificación de archivos**: El script verifica que todos los archivos requeridos existan
- ✅ **Manejo de errores**: Errores claros si algo falla

## 🔄 Proceso Completo

### 1. Preparación

```bash
# Asegúrate de tener Node.js instalado
node --version

# Navega a tu directorio de compilado
cd /ruta/a/tu/compilado-unity
```

### 2. Ejecución

```bash
# Ejecuta el script
node make-responsive.js .

# Verás esta salida:
# 🚀 Processing Unity build at: /ruta/a/tu/compilado
# 📋 Checking required files...
# ✅ All required files found
# 💾 Creating backups...
# ✅ Backups created
# 📝 Writing responsive files...
# ✅ index.html updated
# ✅ style.css updated
# 🎉 Unity build successfully converted to responsive!
```

### 3. Verificación

- Abre `index.html` en tu navegador
- Prueba diferentes tamaños de ventana
- Verifica que el juego se mantenga centrado y con las proporciones correctas

## 🐛 Solución de Problemas

### Error: "Directory does not exist"

```bash
# Verifica que la ruta sea correcta
ls -la /ruta/a/tu/compilado
```

### Error: "Required file not found"

```bash
# Verifica que todos los archivos estén presentes
ls -la Build/
ls -la TemplateData/
```

### El juego no se ve bien

```bash
# Restaura los archivos originales desde backup
cp backup/index.html.backup index.html
cp backup/style.css.backup TemplateData/style.css
```

## 📊 Resultados

Después de ejecutar el script:

| Antes                       | Después                               |
| --------------------------- | ------------------------------------- |
| ❌ Solo funciona en desktop | ✅ Funciona en todos los dispositivos |
| ❌ Elementos innecesarios   | ✅ Interfaz limpia                    |
| ❌ Fondo negro              | ✅ Fondo blanco                       |
| ❌ No responsive            | ✅ Completamente responsive           |
| ❌ Orientación fija         | ✅ Optimizado para portrait           |

## 🎯 Casos de Uso

- **Juegos móviles**: Perfecto para juegos diseñados para móviles
- **Aplicaciones educativas**: Ideal para contenido educativo en tablets
- **Presentaciones**: Excelente para presentaciones interactivas
- **Demostraciones**: Perfecto para demos de productos

## 📞 Soporte

Si encuentras algún problema:

1. Verifica que todos los archivos requeridos estén presentes
2. Revisa la consola del navegador para errores
3. Restaura los archivos desde `backup/` si es necesario
4. Asegúrate de que Node.js esté instalado correctamente

## 🔄 Actualizaciones

Para actualizar tu compilado:

1. Compila una nueva versión desde Unity
2. Ejecuta el script nuevamente: `node make-responsive.js .`
3. Los archivos se actualizarán automáticamente

---

**¡Disfruta de tu compilado de Unity completamente responsive! 🎮✨**
