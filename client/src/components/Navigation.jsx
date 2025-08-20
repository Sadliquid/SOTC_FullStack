import { Flex, Box, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useMemo, useCallback } from 'react'

// Create motion components outside of render
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

export default function Navigation({ onNavigate, currentPage }) {
    // Memoize animation variants to prevent recreation
    const navVariants = useMemo(() => ({
        hidden: { y: -40, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, type: 'spring' } }
    }), []);

    const textVariants = useMemo(() => ({
        tap: { scale: 0.95 }
    }), []);

    // Memoize navigation handlers
    const handleNavigateHome = useCallback(() => {
        onNavigate('home');
    }, [onNavigate]);

    const handleNavigateLabels = useCallback(() => {
        onNavigate('labels');
    }, [onNavigate]);

    return (
        <Box pt={6} px={4} display="flex" justifyContent="center">
            <MotionFlex
                as="nav"
                align="center"
                justify="space-between"
                wrap="wrap"
                padding="1rem"
                bg="black"
                color="white"
                initial="hidden"
                animate="visible"
                variants={navVariants}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.25)"
                borderRadius="full"
                width="auto"
                maxW="600px"
                mx="auto"
                border="1px solid rgba(255, 255, 255, 0.3)"
            >
                <Flex ml={4} mr={10} align="center">
                    <MotionText
                        as="span"
                        fontSize="md"
                        fontWeight="bold"
                        letterSpacing="tight"
                        sx={{ fontFamily: "Cavolini, serif", fontSize: "1.2rem" }}
                    >
                        Sigils of <Text as="span" color="red.500" display="inline" sx={{ fontFamily: "Cavolini, serif", marginLeft: 1 }}>The Codex</Text>
                    </MotionText>
                </Flex>
                <Flex mr={4}>
                    <MotionText
                        mx={3}
                        fontSize="md"
                        cursor="pointer"
                        color={currentPage === 'home' ? 'white' : 'gray.500'}
                        onClick={handleNavigateHome}
                        variants={textVariants}
                        whileTap="tap"
                        transition={{ duration: 0.2 }}
                    >
                        Analyse
                    </MotionText>
                    <MotionText
                        mx={3}
                        fontSize="md"
                        cursor="pointer"
                        color={currentPage === 'labels' ? 'white' : 'gray.500'}
                        onClick={handleNavigateLabels}
                        variants={textVariants}
                        whileTap="tap"
                        transition={{ duration: 0.2 }}
                    >
                        Populate
                    </MotionText>
                </Flex>
            </MotionFlex>
        </Box>
    );
}