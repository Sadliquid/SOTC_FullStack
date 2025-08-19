// This file contains custom theme overrides for Chakra UI to create a modern, animated look.
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        bg: 'gray.900',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif',
        minHeight: '100vh',
      },
      a: {
        color: 'teal.300',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'xl',
        transition: 'all 0.2s',
      },
      variants: {
        solid: {
          bg: 'teal.400',
          color: 'white',
          _hover: {
            bg: 'teal.500',
            transform: 'scale(1.05)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        borderRadius: 'md',
      },
    },
  },
});

export default theme;
