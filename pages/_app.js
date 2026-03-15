import '../styles/globals.css'
import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp