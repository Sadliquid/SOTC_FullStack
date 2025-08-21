import { Box, Flex } from "@chakra-ui/react";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import LabelsPage from "./pages/LabelsPage";
import { useState } from "react";

function App() {
	const [currentPage, setCurrentPage] = useState("home");

	const renderPage = () => {
		switch (currentPage) {
			case "labels":
				return <LabelsPage />;
			default:
				return <HomePage />;
		}
	};

	return (
		<Box minH="100vh" bg="black" backgroundImage="linear-gradient(to bottom, black, #111)" color="white">
			<Navigation onNavigate={setCurrentPage} currentPage={currentPage} />
			<Flex justify="center" align="center" minH="calc(90vh - 120px)" p={[4, 8]} maxW="container.xl" mx="auto">
				{renderPage()}
			</Flex>
		</Box>
	);
}

export default App;