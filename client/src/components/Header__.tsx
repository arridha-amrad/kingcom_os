import useTheme from '@/hooks/useTheme'
import { Link } from '@tanstack/react-router'
import { Sun, Moon } from 'lucide-react'

export default function Header() {
  const { toggleTheme, theme } = useTheme()
  return (
    <header className="p-2 flex gap-2 bg-background text-foreground justify-between">
      <nav className="flex flex-row">
        <button onClick={toggleTheme}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <div className="px-2 font-bold">
          <Link to="/dummy">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/dummy/demo/form/simple">Simple Form</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/dummy/demo/form/address">Address Form</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/dummy/demo/tanstack-query">TanStack Query</Link>
        </div>
      </nav>
    </header>
  )
}
