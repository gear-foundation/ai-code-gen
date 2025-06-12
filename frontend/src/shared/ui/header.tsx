import { Logo } from "./logo"

export const Header = () => {
  return (
    <header className="flex min-h-25 items-center bg-background">
      <div className="container">
        <Logo />
      </div>
    </header>
  )
}
