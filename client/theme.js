import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "'Inter', sans-serif",
      },
    },
  },
  colors: {
    brand: {
      50: '#e6f7ff',
      500: '#3182ce',
      900: '#1a365d',
    },
  },
})

export default theme