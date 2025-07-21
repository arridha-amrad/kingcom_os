import useTheme from '@/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'

export default function ButtonTheme() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}
