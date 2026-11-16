# Usuarios y publicaciones

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

En escritorio la app ocupa la altura de la ventana y la lista de usuarios y el panel de publicaciones tienen cada uno su scroll, así puedo recorrer la lista sin perder de vista las publicaciones. El buscador queda fijo encima de la lista. En móvil lo dejé con un único scroll de página a propósito: los scrolls anidados en pantallas táctiles atrapan el dedo y no se sabe qué se está moviendo. Uso `h-dvh` en lugar de `h-screen` para que la altura no falle con la barra del navegador móvil.

**Usuario elegido en la URL**

El usuario seleccionado vive en la ruta (`/users/:id`, con React Router): se puede compartir el enlace, funciona el botón atrás y sobrevive a un refresco. Las filas son `NavLink`, que marca la activa con `aria-current="page"`; el estilo de seleccionado cuelga de ese mismo atributo, así lo visual y lo accesible no se pueden desincronizar. El detalle reutiliza la lista ya cargada (misma query y caché), así que elegir un usuario no hace otra petición, y un id que no existe o no es un número muestra "Usuario no encontrado". En móvil solo se ve una parte cada vez: la lista en `/` y el detalle en `/users/:id` con un enlace para volver. La lista se oculta con CSS en lugar de desmontarse, para que conserve el texto de búsqueda al volver.

**Detalle del usuario: ficha y publicaciones**

Arriba, una ficha con lo que no cabe en la fila de la lista: avatar grande (del mismo color, para que se reconozca a la misma persona), nombre, `@username`, email (`mailto:`), empresa, ciudad y web (en otra pestaña, con `rel="noopener noreferrer"`). Debajo, sus publicaciones como tarjetas, con skeleton de la misma forma mientras cargan, error con reintento y estado vacío. Los títulos de la API vienen en minúscula y solo capitalizo la primera letra con CSS; el cuerpo respeta sus saltos de línea. `PostList` lleva `key` por usuario para no arrastrar estado al cambiar de uno a otro.

**Paginación de las publicaciones en el cliente**

5 publicaciones por página. La API permite paginar con `?_page=&_limit=`, pero las publicaciones del usuario ya están cargadas (10 por usuario) y las que cree vivirán en la misma caché sin existir en el servidor: paginando en el servidor no saldrían. Cortar en el cliente no necesita otra petición y la lógica es una función pura (`paginate`) fácil de testear. La página vive en la URL (`?page=2`), igual que el usuario elegido: se puede compartir, el botón atrás funciona y al cambiar de usuario se vuelve a la primera. Una página fuera de rango (`?page=99`, `?page=abc`) se ajusta a la más cercana válida. La página actual lleva `aria-current="page"`, el rango ("6–10 de 10 publicaciones") se anuncia con `aria-live` y, al cambiar de página, la lista vuelve a su principio sin animación.

**Qué muestra cada usuario en la lista**

La lista sirve para reconocer y elegir, no para leer la ficha, así que cada fila lleva solo avatar con iniciales, nombre y email (que lo identifica sin ambigüedad). El resto (`@username`, empresa, ciudad, web) va en la cabecera del detalle. El color del avatar sale del `id`, así cada usuario conserva el suyo al recargar o filtrar. Las iniciales salen de una función pura que ignora tratamientos como "Mrs." y usa las dos primeras palabras ("Nicholas Runolfsdottir V" → NR). Nombre y email se cortan con "…" si no caben, con el valor completo en `title`.

**Búsqueda de usuarios en el cliente**

La API permite filtrar con `?name_like=`, pero son 10 usuarios que ya tengo cargados para pintar la lista. Filtrar en el navegador es instantáneo, evita debounce y respuestas que llegan desordenadas, y me deja ignorar mayúsculas y tildes (`name_like` no ignora las tildes, y `?q=` busca en todos los campos, no solo en el nombre). Uso `useDeferredValue` para que escribir no se bloquee. La lista va ordenada por nombre de la A a la Z: se ordena una sola vez al llegar los datos (con `select` de TanStack Query, que memoriza el resultado) usando `Intl.Collator("es")`, así mayúsculas y tildes no alteran el orden y el filtro lo conserva sin reordenar en cada tecla. Con muchos usuarios o paginación pasaría al servidor, con debounce y el texto en la query key.

## Qué haría con más tiempo

- Validar las respuestas de la API en tiempo de ejecución (por ejemplo con zod) en lugar de confiar en el contrato.
- Guardar el texto de búsqueda en la URL (`?q=`) para que sobreviva a un refresco y se pueda compartir.
- Si hubiera muchas publicaciones, paginar en el servidor (`_page`, `_limit` y la cabecera `x-total-count`) y resumir los números de página con "…".
