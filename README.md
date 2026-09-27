# SENDER — Ingeniería de la señal

Experiencia nueva para [Sender Chile](https://www.sender.cl/). No es un rediseño de la interfaz anterior: el repositorio [sender](https://github.com/cristianoleamiranda-dotcom/sender) aporta hechos, textos, fichas e imágenes. La composición, el recorrido y el sistema de movimiento son otros.

Repositorio de esta experiencia: [sender-immersive](https://github.com/cristianoleamiranda-dotcom/sender-immersive).

## Recorrido

Entrada → señal → Sender → ingeniería → transmisión → archivo de proyectos → tecnología → contacto.

## Puesta en marcha

```bash
npm ci
npm run dev
npm run build
npm run qa
```

`npm run build` exige Node 20+ y genera `dist/`, el sitemap y cascarones HTML por ruta.

## Idiomas

Español en `/`. Inglés en `/en`. El interruptor ES / EN conserva la ruta.

## Paleta

`#FFFFFF` `#1E73BE` `#494949` `#0085B2`. Nada más.

## Notas

- Three.js se carga solo en escritorio, con puntero fino y sin reduced motion. En móvil la señal es canvas 2D.
- El formulario abre el cliente de correo. No guarda datos.
- Inventario: `docs/CONTENT-INVENTORY.md`. Skills: `docs/SKILLS.md`.
