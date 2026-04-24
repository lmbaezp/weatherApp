# 🌤️ Clima App - Open-Meteo

Aplicación web para consultar el clima actual y pronóstico extendido de cualquier ciudad del mundo, con pronóstico de varios días.

## ▶️ Ver Demo

- **Página en vivo**: [https://climaapp26.netlify.app/](https://climaapp26.netlify.app/)
- **Video demo**: [Ver en Google Drive](https://drive.google.com/file/d/1qECRZjPXTE1YQkT2U54mrKE7KwE7BExH/view?usp=sharing)

## 🚀 Características

- **Búsqueda por ciudad**: Geocoding API para obtener coordenadas
- **Clima actual**: Temperatura, humedad, velocidad del viento
- **Pronóstico extendido**: Rango de fechas (hasta 16 días) en carrusel
- **Diseño responsive**: Funciona en móviles y escritorio
- **Manejo de errores**: Mensajes con SweetAlert

## 📁 Estructura

```
IA/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos CSS
├── js/
│   └── weather.js      # Lógica JavaScript
└── tests/
    └── weather.test.js # Pruebas unitarias
```

## 🛠️ Tecnologías

- HTML5 + Bootstrap 5.3
- CSS3 con variables personalizadas
- JavaScript (ES6+)
- Open-Meteo API (Geocoding + Weather)
- SweetAlert2 para mensajes

## 🔧 Uso

1. Abre `index.html` en un navegador
2. Ingresa el nombre de una ciudad (ej: Paris, Madrid, Buenos Aires)
3. Opcional: Selecciona fecha de inicio y fin para ver el forecast
4. Haz clic en "Buscar Clima"

## 📋 API

| Endpoint | Descripción |
|----------|-------------|
| `geocoding-api.open-meteo.com/v1/search` | Geocodificación de ciudades |
| `api.open-meteo.com/v1/forecast` | Datos meteorológicos |

## ⚠️ Errores y Manejo

| Error | Causa | Solución |
|-------|-------|----------|
| "No se encontró la ciudad" | Nombre inválido o mal escrito | Verificar ortografía |
| "Error al conectar con el servicio" | Fallo en geocodificación | Reintentar más tarde |
| "Error al obtener datos meteorológicos" | API de clima no responde | Verificar conexión |
| "Error al obtener el pronóstico" | Rango de fechas inválido | Verificar fechas seleccionadas |
| "La fecha de inicio debe ser anterior a la fecha fin" | Fechas mal ordenadas | Ajustar orden de fechas |
| "El rango máximo de días es 16" | Excedió límite de días | Reducir rango a 16 días o menos |

## 🔒 Seguridad

- **Sin datos personales**: La app no recopila información sensible
- **APIs públicas**: Open-Meteo es un servicio gratuito y abierto
- **Validación en cliente**: Los datos de entrada se validan antes de enviarse
- **Sin almacenamiento**: No se guardan datos en el navegador ni en servidores

## � Próximas mejoras

### UX/UI
- Agregar iconos dinámicos según el código del clima (sol, nube, lluvia)
- Animación de transición suave entre días del carrusel
- Modo oscuro (dark mode)
- Historial de ciudades buscadas recientemente

### Funcionalidad
- Pronóstico hourly para el día actual
- Alertas meteorológicas (tormentas, calor extremo)
- Geolocalización para clima actual automático
- Exportar datos a PDF o compartir

### Rendimiento
- Cachear respuestas de API
- Comprimir imágenes y recursos estáticos
- Lazy loading del carrusel

## �📄 Licencia

MIT - Puedes usar, modificar y distribuir este proyecto libremente.
Solo requiere mantener el aviso de copyright en el código.