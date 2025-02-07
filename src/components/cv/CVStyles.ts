// components/cv/CVStyles.ts
import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: "40 40", // Adjusted padding to match the image
    fontFamily: "LibreBaskerville",
    backgroundColor: "#FFFFFF",
  },
  header: {
    textAlign: "center",
    marginBottom: 10, // Increased margin
  },
  name: {
    fontSize: 16, // Slightly reduced font size
    fontFamily: "LibreBaskerville",
    fontStyle: "bold",
    fontWeight: 700,
    marginBottom: 8, // Reduced space between name and contact
    color: "#000000",
  },
  contact: {
    fontSize: 9.0, // Fine-tuned contact info size
    fontFamily: "LibreBaskerville",
    color: "#000000",
    lineHeight: 1.4,
  },
  link: {
    color: "#000000",
    textDecoration: "underline",
  },
  descriptionContainer: {
    marginTop: 4, // Added small margin top
  },
  description: {
    fontSize: 9.5, // Matched description size with contact info
    fontFamily: "LibreBaskerville",
    lineHeight: 1.5,
    color: "#000000",
    textAlign: "justify",
    paddingRight: 2, // Small padding to help with text alignment
  },
});
