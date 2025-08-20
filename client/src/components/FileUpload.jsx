import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Button,
  VStack,
  Image,
  Text,
  Progress,
  useToast
} from '@chakra-ui/react'
import { AttachmentIcon } from '@chakra-ui/icons'

export default function FileUpload({ onUpload, multiple = false, endpoint }) {
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef()
  const toast = useToast()

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    const files = fileInputRef.current.files
    if (files.length === 0) {
      toast({
        title: 'No file selected',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append(multiple ? 'files' : 'file', file)
    })

    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      onUpload(data)
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  const MotionButton = motion(Button);
  const MotionImage = motion(Image);
  return (
    <VStack spacing={6} w="100%" align="center" justify="center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept="image/*"
        hidden
      />
      <MotionButton
        onClick={() => fileInputRef.current.click()}
        leftIcon={<AttachmentIcon />}
        colorScheme="teal"
        size="lg"
        whileHover={{ boxShadow: '0 0 12px #38b2ac' }}
        whileTap={{ scale: 0.96 }}
        borderRadius="full"
        shadow="md"
      >
        Select Image{multiple && 's'}
      </MotionButton>

      {preview && (
        <MotionImage
          src={preview}
          alt="Preview"
          maxH="300px"
          borderRadius="xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          shadow="lg"
        />
      )}

      <MotionButton
        onClick={handleUpload}
        isLoading={isLoading}
        loadingText="Processing..."
        colorScheme="blue"
        w="100%"
        size="lg"
        whileHover={{ boxShadow: '0 0 12px #4299e1' }}
        whileTap={{ scale: 0.96 }}
        borderRadius="full"
        shadow="md"
      >
        Analyze Image{multiple && 's'}
      </MotionButton>

      {isLoading && <Progress size="sm" isIndeterminate w="100%" colorScheme="blue" />}
    </VStack>
  )
}