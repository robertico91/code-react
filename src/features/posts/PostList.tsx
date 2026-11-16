import { EmptyState, PostsIcon } from "@/components/EmptyState";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { ErrorMessage } from "@/components/StatusMessage";
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

  return (
    <>
      <p className="mb-3 text-xs text-slate-500">
        {posts.length === 1 ? "1 publicación" : `${posts.length} publicaciones`}
      </p>
      <ul className="space-y-3">
        {posts.map((post) => (
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
    </>
  );
}

/** Misma forma que las tarjetas reales: contador, título y cuatro líneas de texto. */
function PostListSkeleton() {
  return (
    <Skeleton label="Cargando publicaciones…">
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
