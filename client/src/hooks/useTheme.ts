import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'
export default function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  const toggleTheme = () => {
    const theme = localStorage.getItem('theme')
    const isDarkMode = document.documentElement.classList.contains('dark')
    const isDark = (theme && theme === 'dark') || isDarkMode
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setTheme('light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setTheme('dark')
    }
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  return { toggleTheme, theme }
}
