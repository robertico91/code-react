# Usuarios y publicaciones

[![CI](https://github.com/robertico91/code-react/actions/workflows/ci.yml/badge.svg)](https://github.com/robertico91/code-react/actions/workflows/ci.yml)

App en React + TypeScript que consume la API pública de [JSONPlaceholder](https://jsonplaceholder.typicode.com): lista de usuarios con búsqueda y, al elegir uno, sus publicaciones y un formulario para crear una nueva.

> Lo voy completando a medida que avanzo; cada decisión se añade en el mismo commit que la introduce.

## Cómo ejecutarlo

Requisitos: Node 20.19+ o 22.12+ (lo que pide Vite 8).

```sh
npm install
npm run dev        # http://localhost:5173
```

Otros scripts:

```sh
npm test              # tests (Vitest + Testing Library + MSW)
npm run test:watch    # tests en modo watch
npm run build         # typecheck + build de producción
npm run typecheck
npm run lint          # oxlint
npm run format:check  # prettier
```

La API responde muy rápido, así que los estados de carga casi no se ven. Para verlos: DevTools → Network → "Slow 4G". Para ver los errores: "Offline" y recargar.

## Decisiones

**Stack**

- **Vite + React 19 + TypeScript en modo `strict`** (con `noUncheckedIndexedAccess`). Es una SPA sin SEO ni SSR, así que Next.js sobraba.
- **TanStack Query** para los datos remotos. Me da carga, error, caché, reintento y cancelación sin escribirlos a mano; un `useEffect` con `fetch` me habría obligado a gestionar las peticiones cruzadas al cambiar rápido de usuario.
- **Tailwind CSS v4.** UI limpia y responsive en poco tiempo, sin CSS a medida. Los patrones que se repiten (botón, mensajes de estado) están en componentes para que el JSX se lea bien. No añadí librería de componentes: para dos pantallas no compensa.
- **oxlint + Prettier.** oxlint es el linter que trae ahora la plantilla de Vite; lo mantuve en lugar de migrar a ESLint.

**Estructura**

- Organizada por feature (`features/users`, `features/posts`) y no por tipo de archivo; `api/` para el acceso a la API y `components/` para lo compartido.
- Alias `@/` → `src/`, configurado antes del primer import para no tener que tocar todos los archivos después.
- Los tests van junto al archivo que prueban; `src/test/` es solo para la infraestructura.
- Las carpetas aparecen con su primer archivo, sin carpetas vacías.

**Cliente de la API**

- `fetch` no falla con un 4xx/5xx, así que `fetchJson` comprueba `res.ok` y lanza un `ApiError` con el código HTTP (0 si no hubo respuesta), que se muestra en el mensaje de error. Al principio tenía también `getUser` para detectar un usuario inexistente por el 404, pero lo quité: el detalle saca el usuario de la lista que ya está en caché, así que no hace falta pedirlo aparte.
- Antes de escribirlo probé la API real: `/users/999` responde 404 y `POST /posts` responde 201 con `id: 101` sin guardar nada.

**Carga y errores**

- Un solo reintento automático en lugar de los 3 por defecto: con 3, el mensaje de error tardaba varios segundos en salir, y el usuario ya tiene un botón "Reintentar".
- Sin recarga al volver a la pestaña: los datos de JSONPlaceholder no cambian.
- Cada lista tiene estado de carga, error con reintento (`role="alert"`) y estado vacío.
- **Skeleton en lugar de spinner para las listas.** Conozco la forma del contenido, así que el skeleton (con la misma estructura y alto de fila que la lista real) evita el salto de layout al llegar los datos y la espera parece más corta. Es decorativo (`aria-hidden`); la carga se anuncia con un `role="status"` oculto, y el pulso respeta `prefers-reduced-motion`. El spinner lo reservo para acciones en curso, como enviar el formulario.
- La carga y el error solo sustituyen los resultados: el buscador está siempre visible y se puede escribir mientras llegan los datos.

**Layout maestro-detalle con scroll independiente**

En escritorio la app ocupa la altura de la ventana y la lista de usuarios y la de publicaciones tienen cada una su scroll, así puedo recorrer una sin perder de vista la otra. En el detalle solo se desplaza la lista de publicaciones: la ficha del usuario queda fija arriba y la paginación justo debajo de la lista, siempre visible. Como las tarjetas no tienen nada enfocable, la lista lleva `tabIndex={0}` (con el título "Publicaciones" como nombre) para poder desplazarla con el teclado. El buscador queda fijo encima de la lista. En móvil se ve una cosa cada vez. En la lista, la app ocupa la altura de la pantalla y solo se desplaza el listado, con título, contador y buscador fijos: como la página en sí no se desplaza, no hay scrolls anidados, que en pantallas táctiles atrapan el dedo y no se sabe qué se está moviendo. En el detalle hay un único scroll de página, con la cabecera y la barra "Volver a usuarios" fijas arriba. Uso `h-dvh` en lugar de `h-screen` para que la altura no falle con la barra del navegador móvil.

**Usuario elegido en la URL**

El usuario seleccionado vive en la ruta (`/users/:id`, con React Router): se puede compartir el enlace, funciona el botón atrás y sobrevive a un refresco. Las filas son `NavLink`, que marca la activa con `aria-current="page"`; el estilo de seleccionado cuelga de ese mismo atributo, así lo visual y lo accesible no se pueden desincronizar. El detalle reutiliza la lista ya cargada (misma query y caché), así que elegir un usuario no hace otra petición, y un id que no existe o no es un número muestra "Usuario no encontrado". En móvil solo se ve una parte cada vez: la lista en `/` y el detalle en `/users/:id` con un enlace para volver. La lista se oculta con CSS en lugar de desmontarse, para que conserve el texto de búsqueda al volver.

**Detalle del usuario: ficha y publicaciones**

Arriba, una ficha con lo que no cabe en la fila de la lista: avatar grande (del mismo color, para que se reconozca a la misma persona), nombre, `@username`, email (`mailto:`), empresa, ciudad y web (en otra pestaña, con `rel="noopener noreferrer"`). Debajo, sus publicaciones como tarjetas, con skeleton de la misma forma mientras cargan, error con reintento y estado vacío. Los títulos de la API vienen en minúscula y solo capitalizo la primera letra con CSS; el cuerpo respeta sus saltos de línea. `PostList` lleva `key` por usuario para no arrastrar estado al cambiar de uno a otro.

**Formulario de nueva publicación**

Controlado a mano: son dos campos obligatorios, así que react-hook-form y zod me parecían excesivos; la validación es una función pura (`validatePost`) que recorta espacios (un título de solo espacios no vale). Se abre en un panel lateral derecho desde el botón "Nueva publicación", que es donde se suelen esperar los formularios en panel: no le quita sitio a la lista cuando no se usa y, en escritorio, deja a la vista la columna de usuarios y parte de la ficha; además el panel recuerda para quién se publica ("Para Leanne Graham"). Lo hice con `<dialog>` y `showModal()` en lugar de un modal a mano: el navegador ya mantiene el foco dentro, deja el fondo inerte (tampoco lo lee el lector de pantalla), cierra con Escape y devuelve el foco al botón al cerrar. Al abrirlo, el foco va al título; se cierra con ×, Cancelar, Escape o clic en el fondo, salvo durante el envío. Con el panel abierto, la página de fondo no se desplaza, y la entrada deslizándose desde la derecha se desactiva con `prefers-reduced-motion`. Se valida al enviar y, a partir de ahí, también al escribir, para que el error desaparezca en cuanto se corrige pero no salga mientras uno escribe por primera vez. Al enviar con errores el foco va al primer campo inválido, que lleva `aria-invalid` y el mensaje enlazado con `aria-describedby`; no uso `role="alert"` en cada campo porque se anunciarían todos a la vez. Mientras se envía, los campos son `readOnly` y los botones `aria-disabled` en lugar de `disabled`: deshabilitar el elemento que tiene el foco lo manda al `<body>` y el lector de pantalla se pierde.

**Crear una publicación**

`POST /posts` responde 201 pero JSONPlaceholder no guarda nada, así que la publicación devuelta se añade arriba de la lista directamente en la caché de TanStack Query (`setQueryData` en el `onSuccess` de la mutación). Para que no desaparezca, la query de publicaciones usa `staleTime: Infinity` (no se recarga sola) y `gcTime: Infinity` (al cambiar de usuario y volver, sigue ahí). Como la API responde siempre `id: 101`, al crear dos publicaciones React avisaba de `key` duplicadas (lo vi en la consola al probarlo); ahora cada una recibe un id local negativo y decreciente (-1, -2…), que sigue siendo un número y nunca coincide con los de la API. Tras crearla se cierra el panel y se vuelve a la página 1 con la lista arriba para que se vea. Mientras se envía, el panel no se puede cerrar.

**Toasts de confirmación y de error**

Al crear una publicación sale un toast "Publicación creada"; si falla, uno de error con el motivo, y el panel sigue abierto con lo escrito. Los hice a mano (`components/toast`) en lugar de añadir una librería: son dos variantes y un visor. Las confirmaciones van a una región `aria-live="polite"` siempre montada y se cierran solas a los 4 segundos, pausándose con el ratón o el foco encima; los errores llevan `role="alert"` y no se cierran solos, porque hay que poder leerlos. El detalle que más me costó: el panel es un `<dialog>` modal en la capa superior y deja inerte el resto de la página, así que un toast normal quedaría detrás del fondo, sin poder cerrarse y sin anunciarse; por eso los errores (que llegan con el panel abierto) se pintan dentro del panel con un portal. El error se retira al reintentar o al cerrar el panel.

**Paginación de las publicaciones en el cliente**

5 publicaciones por página. La API permite paginar con `?_page=&_limit=`, pero las publicaciones del usuario ya están cargadas (10 por usuario) y las que cree vivirán en la misma caché sin existir en el servidor: paginando en el servidor no saldrían. Cortar en el cliente no necesita otra petición y la lógica es una función pura (`paginate`) fácil de testear. La página vive en la URL (`?page=2`), igual que el usuario elegido: se puede compartir, el botón atrás funciona y al cambiar de usuario se vuelve a la primera. Una página fuera de rango (`?page=99`, `?page=abc`) se ajusta a la más cercana válida. La página actual lleva `aria-current="page"`, el rango ("6–10 de 10 publicaciones") se anuncia con `aria-live` y, al cambiar de página, la lista vuelve a su principio sin animación.

**Qué muestra cada usuario en la lista**

La lista sirve para reconocer y elegir, no para leer la ficha, así que cada fila lleva solo avatar con iniciales, nombre y email (que lo identifica sin ambigüedad). El resto (`@username`, empresa, ciudad, web) va en la cabecera del detalle. El color del avatar sale del `id`, así cada usuario conserva el suyo al recargar o filtrar. Las iniciales salen de una función pura que ignora tratamientos como "Mrs." y usa las dos primeras palabras ("Nicholas Runolfsdottir V" → NR). Nombre y email se cortan con "…" si no caben, con el valor completo en `title`.

**Búsqueda de usuarios en el cliente**

La API permite filtrar con `?name_like=`, pero son 10 usuarios que ya tengo cargados para pintar la lista. Filtrar en el navegador es instantáneo, evita debounce y respuestas que llegan desordenadas, y me deja ignorar mayúsculas y tildes (`name_like` no ignora las tildes, y `?q=` busca en todos los campos, no solo en el nombre). Uso `useDeferredValue` para que escribir no se bloquee. La lista va ordenada por nombre de la A a la Z: se ordena una sola vez al llegar los datos (con `select` de TanStack Query, que memoriza el resultado) usando `Intl.Collator("es")`, así mayúsculas y tildes no alteran el orden y el filtro lo conserva sin reordenar en cada tecla. Con muchos usuarios o paginación pasaría al servidor, con debounce y el texto en la query key.

**Accesibilidad**

Pasé axe-core en el navegador (detalle, panel abierto, inicio y página no encontrada). Solo salió contraste insuficiente en dos textos grises (4,34:1 y 4,42:1, frente al 4,5:1 mínimo), que oscurecí. Además de lo que no ve axe:

- Al navegar en móvil el foco ya no se pierde: al elegir un usuario la lista se oculta y el enlace pulsado desaparece, así que el foco va al nombre del usuario; al volver, al título "Usuarios". En escritorio no se toca (el enlace sigue visible), ni en la carga inicial.
- En el detalle, un enlace "Saltar a las publicaciones" que solo se ve al tabular, para no recorrer los 10 usuarios con el teclado.
- El título de la pestaña cambia con la pantalla ("Leanne Graham · Usuarios y publicaciones"): en una SPA es lo primero que anuncia un lector de pantalla.
- Ya venía de antes: un único `h1`, landmarks (cabecera, `aside` "Usuarios", `main`), foco visible en todo, `aria-current` en el usuario y la página actuales, avisos con `aria-live` y `role="alert"`, y animaciones que respetan `prefers-reduced-motion`.

Para que no se rompa, hay un test con axe en las pantallas principales (sin la regla de contraste, que jsdom no puede medir). Lo comprobé quitando el nombre a un botón de la paginación: el test falla.

**Tests**

36 tests con Vitest, Testing Library y MSW (`npm test`, unos 8 s). La mayoría montan la app entera en una ruta (`renderApp`) y la usan como una persona: buscan por rol y nombre accesible (nunca `getByTestId`), escriben y pulsan con `user-event`, y la red la simula MSW con el mismo comportamiento que JSONPlaceholder (404, id 101 al crear). Cubren:

- Lista: orden alfabético, búsqueda sin mayúsculas ni tildes, estado vacío con "Ver todos los usuarios" (y el foco de vuelta al buscador), error con "Reintentar" y selección de un usuario.
- Publicaciones: paginación, usuario sin publicaciones y usuario inexistente.
- Nueva publicación: foco al abrir, validación (también con solo espacios) sin llegar a enviar, creación con su toast, error de envío conservando lo escrito, Escape, y la regresión del id 101 (dos publicaciones creadas sin keys duplicadas).
- Funciones puras: `filterUsers`, `sortUsersByName`, `getInitials`, `paginate` y `validatePost`.

Para comprobar que los tests sirven, rompí la app a propósito cuatro veces (quitar el id local, el `trim` de la validación, el orden y la comprobación de `res.ok`) y en cada caso falló el test que tenía que fallar.

**Integración continua**

Cada push a `main` y cada pull request pasan por GitHub Actions (`.github/workflows/ci.yml`): `npm ci`, typecheck, lint, formato, tests y build, con Node 22. Es lo mismo que ejecuto en local antes de cada commit, así que un fallo en la CI significa que algo se escapó. Si llegan dos pushes seguidos, la ejecución anterior se cancela.

## Qué haría con más tiempo

- Validar las respuestas de la API en tiempo de ejecución (por ejemplo con zod) en lugar de confiar en el contrato.
- Guardar el texto de búsqueda en la URL (`?q=`) para que sobreviva a un refresco y se pueda compartir.
- Si hubiera muchas publicaciones, paginar en el servidor (`_page`, `_limit` y la cabecera `x-total-count`) y resumir los números de página con "…".
