/** Re-mounts on every navigation, so each admin page fades in. */
export default function PanelTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in motion-reduce:animate-none">{children}</div>
}
