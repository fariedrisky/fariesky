import { StyleSheet } from "@react-pdf/renderer";

export const HeaderStyles = StyleSheet.create({
    header: {
        textAlign: "center",
        marginBottom: 6, // Reduced from 10
    },
    name: {
        fontSize: 14,
        fontWeight: 700,
        fontStyle: "bold",
        marginBottom: 4, // Reduced from 8
        color: "#000000",
    },
    contact: {
        fontSize: 9.0,
        color: "#000000",
        lineHeight: 1.3, // Reduced from 1.4
    },
    link: {
        color: "#000000",
        textDecoration: "underline",
    },
    descriptionContainer: {
        marginTop: 3, // Reduced from 4
    },
    description: {
        fontSize: 9.5,
        lineHeight: 1.4, // Reduced from 1.5
        color: "#000000",
        textAlign: "justify",
        paddingRight: 2,
    },
});
