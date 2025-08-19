import { useState } from 'react'
import { Container, Heading, VStack, Alert, AlertIcon, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import ResultDisplay from '../components/ResultDisplay'

export default function LabelsPage() {
  const [result, setResult] = useState(null)

  const MotionHeading = motion(Heading);
  const MotionAlert = motion(Alert);
  const MotionText = motion(Text);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  return (
    <Container maxW="container.md" centerContent>
      <VStack spacing={10} w="100%">
        <MotionHeading
          textAlign="center"
          color="teal.300"
          size="2xl"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          fontWeight="extrabold"
          letterSpacing="tight"
        >
          Manage Labels
        </MotionHeading>

        <MotionAlert
          status="info"
          borderRadius="xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <AlertIcon />
          Upload multiple images to help improve the classification system
        </MotionAlert>

        <MotionText
          textAlign="center"
          color="gray.400"
          fontSize="xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Select multiple images to add new labels to the classification system
        </MotionText>

        <FileUpload
          onUpload={setResult}
          multiple={true}
          endpoint="/getLabels"
        />

        <ResultDisplay result={result} />
      </VStack>
    </Container>
  )
}