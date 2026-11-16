import type { Ref } from "react";

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Para devolver el foco al campo (React 19 permite `ref` como prop). */
  ref?: Ref<HTMLInputElement>;
}

export function UserSearch({ value, onChange, ref }: UserSearchProps) {
  return (
    <div className="group relative">
      <label htmlFor="user-search" className="sr-only">
        Buscar usuario por nombre
      </label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand" />
      <input
        ref={ref}
        id="user-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre…"
        autoComplete="off"
        spellCheck={false}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm shadow-sm transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15 focus-visible:outline-none [&::-webkit-search-cancel-button]:cursor-pointer"
      />
    </div>
  );
}

function SearchIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
