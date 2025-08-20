import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Button, VStack, Image, Text, IconButton, Input, FormControl, FormLabel, useToast, Tooltip } from "@chakra-ui/react";
import { AttachmentIcon, CloseIcon } from "@chakra-ui/icons";

export default function FileUpload({ onUpload, multiple = false, endpoint, onImageSelect }) {
	const [isLoading, setIsLoading] = useState(false);
	const [preview, setPreview] = useState(null);
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
			setHasSelectedFile(true);
			setPreview(URL.createObjectURL(files[0]));
			if (onUpload) onUpload(null);
		}
	};

	const handleRemoveImage = () => {
		setPreview(null);
		setHasSelectedFile(false);
		fileInputRef.current.value = null;
		if (onUpload) onUpload(null);
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
			setPreview(null);
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
			<input type="file" ref={fileInputRef} onChange={handleFileChange} multiple={multiple} accept="image/*" hidden />

			{multiple && endpoint === "/populate" && (
				<FormControl>
					<FormLabel>Populate a category</FormLabel>
					<Input mt={2} placeholder="Enter a category name" value={category} onChange={e => setCategory(e.target.value)} bg="black" borderColor="rgba(255, 255, 255, 0.3)" _hover={{ borderColor: "rgba(255, 255, 255, 0.5)" }} />
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
					_hover={{ bg: "red.600" }}
				>
					Select Image{multiple && "s"}
				</MotionButton>
			)}

			{preview && (
				<Box position="relative" w="fit-content" mx="auto" mb={6}>
					<MotionImage src={preview} alt="Preview" maxH="300px" borderRadius="xl" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} shadow="lg" display="block" />
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
						onClick={handleRemoveImage}
						whileTap={{ scale: 0.95 }}
                        _hover={{ bg: "rgba(0, 0, 0, 0.8)" }}
						aria-label="Remove image"
						zIndex={5}
					/>
				</Box>
			)}

			{multiple && preview && (
				<Text fontSize="sm" color="gray.400" mb={4}>
					{fileInputRef.current?.files?.length > 1 ? `${fileInputRef.current.files.length} images selected. Only showing preview of first image.` : "1 image selected"}
				</Text>
			)}

			{hasSelectedFile && (
				<Tooltip label="Enter a category first" isDisabled={!(multiple && endpoint === "/populate" && category.trim() === "")} hasArrow placement="top">
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
						_hover={{ bg: "red.600" }}
						isDisabled={multiple && endpoint === "/populate" && category.trim() === ""}
					>
						Analyze Image{multiple && "s"}
					</MotionButton>
				</Tooltip>
			)}
		</VStack>
	);
}
