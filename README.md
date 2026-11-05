# Brian Tarira · Portfolio 2.0

Portfolio personal de **Cloud & Systems Engineer Junior · DevOps Junior (AWS)**.
Sitio estático, sin dependencias de build, listo para GitHub Pages.

🔗 **Live:** https://briantarira7ea.github.io

## Estructura

```
.
├── index.html              # Estructura y contenido
├── assets/
│   ├── css/style.css       # Tema dark/neon, responsive, reduced-motion
│   ├── js/main.js          # Terminal CLI, simulador ITIL, diagrama clicable
│   └── img/brian.png       # Foto de perfil
├── .nojekyll               # Desactiva Jekyll en GitHub Pages
└── README.md
```

## Funcionalidades

- **Terminal CLI** con comandos `help`, `whoami`, `skills`, `aws status` (simulado), `ls proyectos`, `contact`, `clear` y `sudo hire-me`. Historial con ↑ / ↓.
- **Diagrama de arquitectura interactivo** (SVG): cada nodo abre su descripción, impacto y tecnologías.
- **Simulador ITIL**: atiende tickets por fases, controla el SLA y aprende de las decisiones de riesgo.
- **Métricas animadas**, timeline de experiencia, proyectos y contacto.
- **Accesible**: navegación por teclado, roles ARIA y respeto a `prefers-reduced-motion`.

## Desarrollo local

No requiere build. Opciones:

```bash
# Opción 1: servidor estático de Python
python3 -m http.server 8000
# abre http://localhost:8000

# Opción 2: Node
npx serve .
```

## Personalización

- Contenido y textos: `index.html`.
- Colores y tipografía: variables CSS en `:root` dentro de `assets/css/style.css`.
- Tickets del simulador: array `TICKETS` en `assets/js/main.js`.
- Nodos de arquitectura: objeto `NODES` en `assets/js/main.js` y bloques `<g class="node">` en `index.html`.

## Despliegue

Cada push a `main` de este repositorio (`briantarira7ea.github.io`) se publica automáticamente en GitHub Pages (Settings → Pages → Deploy from branch `main` / root).

## Notas

- Los datos de infraestructura de la terminal (`aws status`) son **simulados** y así están etiquetados.
- Licencia: uso personal. Contenido © Brian Tarira.
