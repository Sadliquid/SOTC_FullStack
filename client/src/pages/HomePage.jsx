import { useState } from 'react'
import { Container, Heading, VStack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import ResultDisplay from '../components/ResultDisplay'

export default function HomePage() {
  const [result, setResult] = useState(null)
  const [imageSelected, setImageSelected] = useState(false)

  const MotionHeading = motion(Heading);
  const MotionText = motion(Text);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleImageSelect = (hasImage) => {
    setImageSelected(hasImage);
  };

  return (
    <Container maxW="container.md" centerContent>
      <VStack spacing={10} w="100%">
        {(!imageSelected || result) && (
          <>
            <MotionHeading
              textAlign="center"
              color="white"
              size="2xl"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              Image Analyser
            </MotionHeading>

            <MotionText
              textAlign="center"
              color="white"
              fontSize="xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Upload an image to detect recyclable items
            </MotionText>
          </>
        )}

        <FileUpload
          onUpload={setResult}
          endpoint="/upload"
          onImageSelect={handleImageSelect}
        />

        <ResultDisplay result={result} />
      </VStack>
    </Container>
  )
}