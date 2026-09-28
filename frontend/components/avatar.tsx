export function Avatar({ username, src, large = false }: { username: string; src?: string | null; large?: boolean }) {
  return src ? <img src={src} alt="" className={`avatar ${large ? 'avatar-lg' : ''}`} /> : <span className={`avatar avatar-fallback ${large ? 'avatar-lg' : ''}`}>{username.slice(0, 1).toUpperCase()}</span>;
}
