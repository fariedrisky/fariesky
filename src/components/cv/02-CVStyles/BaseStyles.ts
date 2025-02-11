import { StyleSheet } from "@react-pdf/renderer";

export const BaseStyles = StyleSheet.create({
    page: {
        padding: "30 30",
        fontFamily: "Georgia",
        backgroundColor: "#FFFFFF",
    },
    section: {
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 700,
        fontStyle: "bold",
        marginBottom: 4,
        textTransform: "uppercase",
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        marginBottom: 4,
    },
});
