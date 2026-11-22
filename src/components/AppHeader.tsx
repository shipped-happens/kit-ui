type AppHeaderProps = {
  name: string
  description: string
}

/** Title and one-line description, the same on every app. */
export function AppHeader({ name, description }: AppHeaderProps) {
  return (
    <header>
      <h1 className="font-app-display text-4xl font-bold tracking-tight">{name}</h1>
      <p className="mt-2 max-w-2xl text-app-muted">{description}</p>
    </header>
  )
}
