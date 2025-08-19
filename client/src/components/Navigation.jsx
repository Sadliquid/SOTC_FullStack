import { Flex, Button, Heading, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionFlex = motion(Flex);
const MotionButton = motion(Button);

const navVariants = {
  hidden: { y: -40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, type: 'spring' } }
};

export default function Navigation({ onNavigate, currentPage }) {
  const bg = useColorModeValue('teal.500', 'teal.700');
  return (
    <MotionFlex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg={bg}
      color="white"
      initial="hidden"
      animate="visible"
      variants={navVariants}
      boxShadow="xl"
    >
      <Heading
        as={motion.h1}
        size="lg"
        transition={{ duration: 0.5 }}
        letterSpacing="tight"
        color="white"
      >
        Recycling Classifier
      </Heading>
      <Flex>
        <MotionButton
          mx={2}
          onClick={() => onNavigate('home')}
          variant={currentPage === 'home' ? 'solid' : 'ghost'}
          colorScheme="whiteAlpha"
          whileHover={{ boxShadow: '0 0 8px #38b2ac' }}
          whileTap={{ scale: 0.95 }}
        >
          Home
        </MotionButton>
        <MotionButton
          mx={2}
          onClick={() => onNavigate('labels')}
          variant={currentPage === 'labels' ? 'solid' : 'ghost'}
          colorScheme="whiteAlpha"
          whileHover={{ boxShadow: '0 0 8px #38b2ac' }}
          whileTap={{ scale: 0.95 }}
        >
          Manage Labels
        </MotionButton>
      </Flex>
    </MotionFlex>
  );
}