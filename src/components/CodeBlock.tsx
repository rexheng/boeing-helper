interface CodeBlockProps {
  children: string
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="bg-[var(--bg-surface-2)] rounded-2xl p-4 overflow-x-auto">
      <code className="font-mono text-sm text-[var(--text-secondary)]">{children}</code>
    </pre>
  )
}
