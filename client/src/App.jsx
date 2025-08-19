import { Box } from '@chakra-ui/react'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import LabelsPage from './pages/LabelsPage'
import { useState } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'labels':
        return <LabelsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Box minH="100vh" bg="gray.900">
      <Navigation onNavigate={setCurrentPage} currentPage={currentPage} />
      <Box p={[4, 8]} maxW="container.xl" mx="auto">
        {renderPage()}
      </Box>
    </Box>
  );
}

export default App