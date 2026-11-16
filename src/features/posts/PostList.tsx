import { useRef } from "react";
import { useSearchParams } from "react-router";
import type { Post } from "@/api/types";
import { EmptyState, PostsIcon } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { ErrorMessage } from "@/components/StatusMessage";
import { paginate } from "./paginate";
import { usePosts } from "./usePosts";

export function PostList({ userId }: { userId: number }) {
  const { data: posts, isPending, isError, error, refetch } = usePosts(userId);

  if (isPending) return <PostListSkeleton />;

  if (isError) {
    return (
      <ErrorMessage
        title="No se pudieron cargar las publicaciones."
        error={error}
        onRetry={() => void refetch()}
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<PostsIcon />}
        title="Sin publicaciones"
        description="Este usuario aún no ha publicado nada."
        titleAs="p"
        className="mt-3"
      />
    );
  }

  return <PaginatedPosts posts={posts} />;
}

/** 10 publicaciones por usuario en la API: con 5 por página salen 2 páginas. */
const PAGE_SIZE = 5;

/**
 * Paginación en el cliente: las publicaciones del usuario ya están cargadas (y
 * las que se creen vivirán en la misma caché), así que cortar en páginas no
 * necesita otra petición. La página vive en la URL (?page=2): se comparte,
 * funciona el botón atrás y al cambiar de usuario se vuelve a la 1.
 */
function PaginatedPosts({ posts }: { posts: Post[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { items, page, totalPages, from, to } = paginate(
    posts,
    Number(searchParams.get("page") ?? "1"),
    PAGE_SIZE,
  );

  function goToPage(nextPage: number) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (nextPage === 1) next.delete("page");
      else next.set("page", String(nextPage));
      return next;
    });
    // Al cambiar de página se vuelve al principio de la lista, sin animación para
    // no marear a quien tiene el movimiento reducido. En escritorio hace scroll la
    // propia lista; en móvil, la página.
    listRef.current?.scrollTo({ top: 0 });
    topRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <div ref={topRef} className="scroll-mt-6 md:flex md:min-h-0 md:flex-1 md:flex-col">
      <p aria-live="polite" className="mb-3 text-xs text-slate-500 tabular-nums">
        {totalPages > 1
          ? `${from}–${to} de ${posts.length} publicaciones`
          : posts.length === 1
            ? "1 publicación"
            : `${posts.length} publicaciones`}
      </p>
      {/* Escritorio: crece con su contenido y, si no cabe, hace scroll solo ella (la
          paginación queda justo debajo, siempre visible). tabIndex para poder
          desplazarla con el teclado: sus tarjetas no tienen elementos enfocables. */}
      <ul
        ref={listRef}
        tabIndex={0}
        aria-labelledby="posts-heading"
        className="space-y-3 rounded-lg focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none md:min-h-0 md:overflow-y-auto md:overscroll-contain"
      >
        {items.map((post) => (
          <li key={post.id}>
            <article className="rounded-lg border border-slate-200 bg-white p-4">
              {/* Los títulos de la API vienen en minúscula: solo se capitaliza la primera letra. */}
              <h4 className="font-medium text-slate-900 first-letter:uppercase">{post.title}</h4>
              {/* El cuerpo trae saltos de línea (\n): se respetan. */}
              <p className="mt-1.5 text-sm/6 whitespace-pre-line text-slate-600 first-letter:uppercase">
                {post.body}
              </p>
            </article>
          </li>
        ))}
      </ul>
      <div className="mt-4 md:shrink-0">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
          label="Paginación de publicaciones"
        />
      </div>
    </div>
  );
}

/** Misma forma que las tarjetas reales: contador, título y cuatro líneas de texto. */
function PostListSkeleton() {
  return (
    <Skeleton label="Cargando publicaciones…" className="md:min-h-0 md:overflow-hidden">
      <div className="mb-3 flex h-4 items-center">
        <SkeletonBlock className="h-3 w-24 rounded" />
      </div>
      <div className="space-y-3">
        {["w-3/4", "w-2/3", "w-4/5"].map((titleWidth) => (
          <div key={titleWidth} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex h-6 items-center">
              <SkeletonBlock className={`h-4 rounded ${titleWidth}`} />
            </div>
            <div className="mt-1.5 space-y-0">
              {["w-full", "w-full", "w-11/12", "w-2/3"].map((lineWidth, index) => (
                <div key={index} className="flex h-6 items-center">
                  <SkeletonBlock className={`h-3 rounded ${lineWidth}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Skeleton>
  );
}
