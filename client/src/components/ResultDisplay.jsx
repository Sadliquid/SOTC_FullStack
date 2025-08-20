import { Box, VStack, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

const MotionBox = motion(Box);

function ResultDisplay({ result }) {
    const fadeIn = useMemo(() => ({
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }), []);

    if (!result) return null;

    return (
        <MotionBox
            key={`result-${JSON.stringify(result)}`}
            mt={6}
            p={6}
            borderWidth={1}
            borderRadius="xl"
            boxShadow="xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            bg="gray.800"
            color="white"
            w="100%"
        >
            <VStack spacing={4} align="stretch">
                {result.result && (
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">
                            <Text as="span" color={result.result === 'Yes' ? 'green.400' : 'red.400'} display="inline">
                                {result.result === 'Yes' ? 'Item is recyclable!' : 'Item is not recyclable.'}
                            </Text>
                        </Text>
                    </Box>
                )}
                {result.category && result.category !== "No match" && (
                    <Box display={"flex"}>
                        <Text fontWeight="semibold">Category: <Text as="span" color="green.300" fontWeight="bold">{result.category || "No match"}</Text></Text>
                    </Box>
                )}
                {result.items && result.items.length > 0 && (
                    <Box>
                        <Text fontWeight="semibold">Detected Items:</Text>
                        <Wrap mt={2}>
                            {result.items.map((item, index) => (
                                <WrapItem key={index}>
                                    <Box
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        bg="rgba(255, 255, 255, 0.1)"
                                        fontSize="sm"
                                    >
                                        {item}
                                    </Box>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                )}
                {result.labelsAdded !== undefined && (
                    <Box>
                        <Text>
                            New Labels Added:{' '}
                            <Text as="span" color="green.300" fontWeight="bold">
                                {result.labelsAdded}
                            </Text>
                        </Text>
                    </Box>
                )}
            </VStack>
        </MotionBox>
    );
}

export default ResultDisplay;