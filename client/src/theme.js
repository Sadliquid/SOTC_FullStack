// This file contains custom theme overrides for Chakra UI to create a modern, animated look.
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	styles: {
		global: {
			"html, body": {
				bg: "gray.900",
				color: "white",
				fontFamily: "Inter, system-ui, sans-serif",
				minHeight: "100vh"
			},
			a: {
				color: "teal.300",
				_hover: {
					textDecoration: "underline"
				}
			}
		}
	},
	fonts: {
		heading: "Inter, system-ui, sans-serif",
		body: "Inter, system-ui, sans-serif"
	},
	colors: {
		brand: {
			900: "#1a365d",
			800: "#153e75",
			700: "#2a69ac"
		}
	},
	components: {
		Button: {
			baseStyle: {
				fontWeight: "bold",
				borderRadius: "full", // Make all buttons pill-shaped by default
				transition: "all 0.2s"
			},
			variants: {
				solid: {
					bg: "red.500",
					color: "white",
					_hover: {
						bg: "red.600",
						boxShadow: "0 0 12px rgba(255, 255, 255, 0.5)"
						// Removed the transform: 'scale(1.05)' to eliminate the scaling effect
					}
				}
			}
		},
		Input: {
			baseStyle: {
				borderRadius: "md"
			}
		}
	}
});

export default theme;
