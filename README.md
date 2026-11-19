# Museos de Córdoba

Primera demo navegable del portal público para mostrarle a Cristian. Frontend con Angular 22, componentes standalone, TypeScript estricto, Router y CSS. Sin backend.

Incluye el panel editorial en **http://127.0.0.1:4300/admin**, sin acceso protegido ni login.

## Panel de Cristian

- Inicio con las acciones Crear noticia y Crear newsletter, actividad reciente y acceso secundario al Directorio.
- Noticias: crear, editar, guardar borradores, previsualizar y publicar en la demo. Hasta tres destacadas en Inicio. Guardar cambios como borrador de una nota publicada conserva su última versión pública hasta volver a publicarla.
- Newsletter: asunto, título e introducción; bloques de noticias publicadas y/o texto exclusivo, ordenables con botones y eliminables. Vista previa de correo y envío simulado sin destinatarios reales. Lo exclusivo no aparece en Noticias ni en la edición pública de ejemplo.
- Museos: agregar y editar fichas. Los cambios guardados se ven en el directorio público.
- Estado compartido mediante signals en `src/app/data/demo-store.service.ts`. Persistencia exclusivamente editorial en la clave local `museos-cordoba-editorial-demo-v1`. Los correos de suscripción pública siguen sin guardarse.
- Si el navegador no permite guardar localmente, se avisa y los cambios quedan en memoria durante la sesión.
- No hay backend, autenticación ni envío real. Banners pendientes.

### Recorrido del panel

1. Crear noticia, guardar borrador y retomarlo desde Actividad reciente. Previsualizar, publicar y comprobar la nota en el portal.
2. Crear newsletter, agregar una noticia publicada y un texto exclusivo, cambiar el orden, guardar y previsualizar. Simular el envío.
3. Desde Directorio, editar el horario de un museo, guardar y abrir Ver ficha pública.

Prueba automatizada del panel: `npm run test:admin`, con las mismas variables de Playwright indicadas al final. Usa contextos de navegador aislados y datos de prueba para no modificar los cambios editoriales de Cristian.

## Ejecutar

### Publicación con GitHub Pages

La entrada animada dura ahora **2,6 segundos** tanto en computadora como en celular. Movimiento reducido conserva la portada inmediata y la animación sigue sin repetirse al volver a Inicio.

El workflow `.github/workflows/pages.yml` compila y publica al actualizar `main`, o manualmente desde Actions. En el repositorio se debe seleccionar **Settings → Pages → Source → GitHub Actions**.

- Instalación en otra máquina: Node 24.15 o compatible, luego `npm install`.
- Build local habitual: `npm run build`. Conserva las rutas normales.
- Build para Pages: `npm run build:pages -- --base-href /museos-de-cordoba/`.
- El workflow obtiene la ruta base del repositorio automáticamente. Las imágenes se resuelven respecto de esa ruta.
- La versión de Pages usa rutas con `#` (por ejemplo `/museos-de-cordoba/#/admin`) para admitir enlaces directos y recargas sin un servidor de rutas.
- El panel sigue siendo una demo local; ningún cambio editorial se comparte entre navegadores.

Preparar el workflow y compilar no publica el sitio: faltan una conexión válida a GitHub y ejecutar el despliegue en el repositorio elegido.

### Inicio rediseñado

Portada de galería a todo el ancho con «La cultura de Córdoba, de museo en museo», entrada mediante clip-path en forma de arco y borde dorado, y CTA «Explorá museos». El arco es más vertical en celular. La secuencia termina en 2,6 s, no usa video ni vuelve a reproducirse al navegar en la misma sesión de la app. Con movimiento reducido, la portada aparece inmediatamente.

El encabezado compartido es compacto y fijo, con escudo a la izquierda y menú hamburguesa hasta 850 px. El CTA desplaza y lleva el foco al buscador, respetando la cabecera fija. Los destacados seleccionados en Admin priorizan las tres tarjetas de Últimas noticias. Se conservan publicidad, suscripción de prueba, las pantallas públicas y el panel.

`npm run test:inicio` verifica el arco, la duración, la ausencia de repetición, movimiento reducido, el recorrido CTA → buscador → Directorio filtrado y menú móvil en 1440, 768, 390 y 320 px. Usa los archivos compilados directamente, con Playwright.

La navegación principal queda visible al hacer scroll. En pantallas de hasta 650 px, las secciones se abren desde Menú; se cierra al navegar, al hacer clic fuera o con Escape, que devuelve el foco al botón. El listado de noticias usa tarjetas más compactas y una disposición horizontal en celular. `npm run test:navigation` verifica estos comportamientos en 1440, 390 y 320 px sobre el build local, sin requerir un servidor.

Desde PowerShell:

```powershell
cd "C:\Users\maxte\Desktop\TPI PROGRA\museos-de-cordoba"
npm start -- --host 127.0.0.1 --port 4300
```

Abrir http://127.0.0.1:4300. Las dependencias ya están disponibles en este entorno.

En otra computadora, instalar Node 24.15 o superior compatible con Angular 22, luego:

```sh
npm install
npm start
npm run build
```

El lanzador usa el Node portable del directorio hermano `.tools` cuando está disponible, porque el Node del sistema (24.14.1) es anterior al mínimo de Angular 22. La aplicación no depende de otros proyectos.

## Recorrido de presentación

1. En Inicio, abrir “Una nueva mirada al arte cordobés”. Volver a noticias, combinar buscador y categoría.
2. Volver a Inicio. Elegir “Alta Gracia” y “Buscar museos”: aparecen dos resultados y los filtros quedan en la URL.
3. Abrir una ficha y volver al directorio. Se conservan los filtros. Limpiarlos para ver las seis fichas.
4. Abrir Newsletter y “Leer edición de ejemplo”. Incluye una carta editorial propia y dos notas enlazadas.
5. Volver, intentar suscribirse con un correo inválido y después con `cristian@ejemplo.com`. Se muestra el check y la confirmación de prueba.

## Estructura

- `src/app/features/`: Inicio, Noticias y nota completa, Directorio y ficha, Newsletter y edición.
- `src/app/shared/components/`: encabezado, pie, tarjetas y formulario compartido con Reactive Forms.
- `src/app/data/models/` y `mocks/`: tipos y fuente única de datos locales.
- `public/images/`: fotografías locales y escudo.
- `src/styles.css`: identidad visual, adaptación móvil, foco y movimiento reducido.

Cada página tiene componente, plantilla y estilos propios. Las páginas se cargan con `loadComponent`. Los filtros se serializan en query params y se conservan en los enlaces de regreso. Búsqueda sin distinción de mayúsculas ni tildes.

## Alcance y recursos

Todos los contenidos, nombres, direcciones, horarios y contactos son ilustrativos. El formulario valida el correo en memoria, lo borra al confirmar y no usa almacenamiento ni servicios externos. No hay cuentas, administración, API ni envío de correos.

Las fotografías fueron extraídas de las maquetas locales suministradas; la interfaz se construyó con componentes reales. El archivo adjunto original `escudo-argentino.png` no estaba accesible como archivo local: se utilizó provisionalmente el escudo de la maqueta en `public/images/escudo-argentino.png`. Reemplazar ese PNG por el original no requiere cambios de código.

Los controles tienen etiquetas, foco visible, tamaños táctiles y navegación de teclado. El resultado de suscripción se anuncia con `role="status"`. Las animaciones se desactivan con `prefers-reduced-motion`.

## Verificación

```sh
npm run build
npm run test:e2e
```

El smoke test requiere Playwright instalado, Chromium y el sitio iniciado en el puerto 4300. Se puede indicar la ubicación del módulo con `PLAYWRIGHT_MODULE` y el origen con `DEMO_URL`. Prueba escritorio y celular, filtros, detalles, edición, formularios, navegación de teclado, imágenes, ausencia de desbordes y movimiento reducido.

Si el entorno bloquea localhost, `STATIC_DEMO=1` hace que Playwright cargue directamente los archivos de `dist` mediante interceptación local, sin conexiones de red. En esta entrega se verificó el build de producción con ese modo en 1440 × 1000 y 390 × 844.
