import { Box, VStack, Text, Tag, Wrap, WrapItem, Heading } from '@chakra-ui/react'
import { motion } from 'framer-motion'

function ResultDisplay({ result }) {
  if (!result) return null;

  const MotionBox = motion(Box);
  const MotionTag = motion(Tag);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <MotionBox
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
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md" color="teal.300" as={motion.h2} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
          Analysis Results
        </Heading>

        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Result:
            <MotionTag
              size="lg"
              colorScheme={result.result === 'Yes' ? 'green' : 'red'}
              ml={2}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {result.result}
            </MotionTag>
          </Text>
        </Box>

        {result.category && result.category !== "No match" && (
          <Box>
            <Text fontWeight="semibold">Category:</Text>
            <MotionTag
              size="lg"
              colorScheme="blue"
              mt={2}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {result.category}
            </MotionTag>
          </Box>
        )}

        {result.items && result.items.length > 0 && (
          <Box>
            <Text fontWeight="semibold">Detected Items:</Text>
            <Wrap mt={2}>
              {result.items.map((item, index) => (
                <WrapItem key={index}>
                  <MotionTag
                    colorScheme="teal"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item}
                  </MotionTag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}

        {result['Received images'] !== undefined && (
          <Box>
            <Text fontWeight="semibold">Batch Processing Results:</Text>
            <Text>Received Images: {result['Received images']}</Text>
            <Text>Successful Scans: {result['Successfull scans']}</Text>
            <Text>Error Scans: {result['Error scans']?.join(', ') || 'None'}</Text>
            <Text>Corrupted Files: {result['Corrupted files']}</Text>
          </Box>
        )}
      </VStack>
    </MotionBox>
  );
}

export default ResultDisplay;