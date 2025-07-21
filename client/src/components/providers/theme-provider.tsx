import { useEffect, type ReactNode } from 'react'

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const saveTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const theme = saveTheme ?? (prefersDark ? 'dark' : 'light')
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])
  return children
}
