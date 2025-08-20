import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Button, VStack, Image, Text, IconButton, Input, FormControl, FormLabel, useToast, Tooltip, HStack, Flex } from "@chakra-ui/react";
import { AttachmentIcon, CloseIcon } from "@chakra-ui/icons";

export default function FileUpload({ onUpload, multiple = false, endpoint, onImageSelect }) {
	const [isLoading, setIsLoading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
	const [hasSelectedFile, setHasSelectedFile] = useState(false);
	const [category, setCategory] = useState("");
	const fileInputRef = useRef();
	const toast = useToast();

	useEffect(() => {
		return () => {
			if (onUpload) onUpload(null);
		};
	}, []);

	useEffect(() => {
		if (onImageSelect) {
			onImageSelect(hasSelectedFile);
		}
	}, [hasSelectedFile, onImageSelect]);

    const handleFileChange = event => {
    const files = event.target.files;
    if (files.length > 0) {
      if (files.length > 10) {
        toast({
          title: "Too many files",
          description: "You can only select up to 10 files at once.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        fileInputRef.current.value = null;
        return;
      }

      setHasSelectedFile(true);

      // Generate previews
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      setCurrentPreviewIndex(0);

      // Clear previous results
      if (onUpload) onUpload(null);
    }
  };

  const handleRemoveImage = index => {
    const dt = new DataTransfer();
    const files = fileInputRef.current.files;
    for (let i = 0; i < files.length; i++) {
      if (i !== index) dt.items.add(files[i]);
    }
    fileInputRef.current.files = dt.files;

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    if (newPreviews.length === 0) {
      setHasSelectedFile(false);
      setCurrentPreviewIndex(0);
      if (onUpload) onUpload(null);
    } else if (currentPreviewIndex >= newPreviews.length) {
      setCurrentPreviewIndex(newPreviews.length - 1);
    }
  };

	const handleUpload = async () => {
		const files = fileInputRef.current.files;
		if (files.length === 0) {
			toast({
				title: "No file selected",
				status: "warning",
				duration: 3000,
				isClosable: true
			});
			return;
		}

		setIsLoading(true);
		const formData = new FormData();

		// Add all files to the form data
		Array.from(files).forEach(file => {
			formData.append(multiple ? "files" : "file", file);
		});

		// If we're on the labels page (multiple is true), add the category
		if (multiple && endpoint === "/populate" && category) {
			formData.append("category", category);
		}

		try {
			const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
				method: "POST",
				body: formData
			});
			const data = await response.json();
			onUpload(data);

			// Reset state after successful upload
			setPreviews([]);
			setHasSelectedFile(false);
			fileInputRef.current.value = null;
		} catch (error) {
			toast({
				title: "Upload failed",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true
			});
		} finally {
			setIsLoading(false);
		}
	};

	const MotionButton = motion(Button);
	const MotionImage = motion(Image);
	const MotionIconButton = motion(IconButton);

	return (
    <VStack spacing={6} w="100%" align="center" justify="center">
      <input
        type="file"
        max={10}
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept="image/*"
        hidden
      />

      {multiple && endpoint === "/populate" && (
        <FormControl>
          <FormLabel>Populate a category</FormLabel>
          <Input
            mt={2}
            placeholder="Enter a category name"
            value={category}
            onChange={e => setCategory(e.target.value)}
            bg="black"
            borderColor="rgba(255, 255, 255, 0.3)"
            _hover={{ borderColor: "rgba(255, 255, 255, 0.5)" }}
          />
        </FormControl>
      )}

      {!hasSelectedFile && (
        <MotionButton
          onClick={() => fileInputRef.current.click()}
          leftIcon={<AttachmentIcon />}
          colorScheme="red"
          size="lg"
          whileHover={{ boxShadow: "0 0 12px rgba(255, 255, 255, 0.5)" }}
          whileTap={{ opacity: 0.8 }}
          borderRadius="full"
          shadow="md"
          bg="red.500"
          color="white"
        >
          Select Image{multiple && "s"}
        </MotionButton>
      )}

      {previews.length > 0 && (
        <Box position="relative" w="fit-content" mx="auto" mb={6}>
          <MotionImage
            src={previews[currentPreviewIndex]}
            alt={`Preview ${currentPreviewIndex + 1}`}
            maxH="300px"
            borderRadius="xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            shadow="lg"
            display="block"
          />
          <MotionIconButton
            icon={<CloseIcon />}
            position="absolute"
            top="10px"
            right="10px"
            borderRadius="full"
            bg="rgba(0, 0, 0, 0.6)"
            border="1px solid rgba(255, 255, 255, 0.3)"
            color="white"
            size="sm"
            onClick={() => handleRemoveImage(currentPreviewIndex)}
            whileTap={{ scale: 0.95 }}
            aria-label="Remove image"
            zIndex={5}
            _hover={{ bg: "rgba(0, 0, 0, 0.6)" }}
          />
        </Box>
      )}

      {multiple && previews.length > 0 && (
        <Flex justifyContent="center" mb={4}>
            <Text fontSize="sm" color="gray.400">
                {previews.length > 1 ? `${currentPreviewIndex + 1} of ${previews.length} images` : "1 image selected"}
            </Text>
        </Flex>
    )}

      {multiple && previews.length > 1 && (
        <HStack spacing={2} overflowX="auto" maxW="100%" p={2} mb={2}>
          {previews.map((preview, index) => (
            <Box
              key={index}
              position="relative"
              cursor="pointer"
              opacity={index === currentPreviewIndex ? 1 : 0.6}
              borderWidth={index === currentPreviewIndex ? "2px" : "0px"}
              borderColor="red.500"
              borderRadius="md"
              onClick={() => setCurrentPreviewIndex(index)}
            >
              <Image
                src={preview}
                alt={`Thumbnail ${index + 1}`}
                h="50px"
                w="50px"
                objectFit="cover"
                borderRadius="md"
              />
              <IconButton
                icon={<CloseIcon />}
                size="xs"
                position="absolute"
                top="-8px"
                right="-8px"
                colorScheme="blackAlpha"
                bg="rgba(0, 0, 0, 0.7)"
                color="white"
                borderRadius="full"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
              />
            </Box>
          ))}
        </HStack>
      )}

      {hasSelectedFile && (
        <Tooltip
          label="Enter a category first"
          isDisabled={!(multiple && endpoint === "/populate" && category.trim() === "")}
          hasArrow
          placement="top"
        >
          <MotionButton
            onClick={handleUpload}
            isLoading={isLoading}
            loadingText="Processing..."
            colorScheme="red"
            size="lg"
            whileHover={{ boxShadow: "0 0 12px rgba(255, 255, 255, 0.5)" }}
            whileTap={{ opacity: 0.8 }}
            borderRadius="full"
            shadow="md"
            bg="red.500"
            color="white"
            isDisabled={multiple && endpoint === "/populate" && category.trim() === ""}
          >
            Analyze Image{multiple && "s"}
          </MotionButton>
        </Tooltip>
      )}
    </VStack>
  );
}
