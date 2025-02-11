import { StyleSheet } from "@react-pdf/renderer";

export const ExperienceStyles = StyleSheet.create({
    experienceContainer: {
        flexDirection: "column",
        marginTop: 6, // Reduced from 8
    },
    experienceItem: {
        width: "100%",
        marginBottom: 8, // Reduced from 10
    },
    experienceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 2, // Reduced from 4
    },
    mainInfo: {
        flex: 1,
        paddingRight: 8, // Reduced from 10
    },
    company: {
        fontSize: 10,
        fontWeight: 700,
        marginBottom: 1, // Reduced from 2
        fontStyle: "bold",
    },
    role: {
        fontSize: 9,
        marginBottom: 2, // Reduced from 4
        fontStyle: "italic",
    },
    locationPeriodContainer: {
        alignItems: "flex-end",
        flexShrink: 0,
        minWidth: "25%", // Reduced from 30%
    },
    location: {
        fontSize: 9,
        marginBottom: 1, // Reduced from 2
        textAlign: "right",
    },
    period: {
        fontSize: 9,
        textAlign: "right",
    },
    descriptionList: {
        marginTop: 2, // Reduced from 4
    },
    descriptionItem: {
        fontSize: 9,
        lineHeight: 1.4, // Reduced from 1.5
        marginBottom: 2, // Reduced from 3
        display: "flex",
        flexDirection: "row",
    },
    bulletPoint: {
        width: 8, // Reduced from 10
        marginRight: 6, // Reduced from 8
    },
    descriptionText: {
        flex: 1,
        textAlign: "justify",
    },
});
