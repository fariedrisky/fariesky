import { StyleSheet } from "@react-pdf/renderer";

export const EducationStyles = StyleSheet.create({
    educationContainer: {
        flexDirection: "column",
        marginTop: 6,
    },
    educationItem: {
        width: "100%",
        marginBottom: 8,
    },
    educationHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 2,
    },
    mainInfo: {
        flex: 1,
        paddingRight: 8,
    },
    school: {
        fontSize: 10,
        fontWeight: 700,
        marginBottom: 1,
        fontStyle: "bold",
    },
    degree: {
        fontSize: 9,
        marginBottom: 2,
        fontStyle: "italic",
    },
    locationPeriodContainer: {
        alignItems: "flex-end",
        flexShrink: 0,
        minWidth: "25%",
    },
    location: {
        fontSize: 9,
        marginBottom: 1,
        textAlign: "right",
    },
    period: {
        fontSize: 9,
        textAlign: "right",
    },
    scoreContainer: {
        marginTop: 1,
    },
    score: {
        fontSize: 9,
    },
    descriptionList: {
        marginTop: 2,
    },
    descriptionItem: {
        fontSize: 9,
        lineHeight: 1.4,
        marginBottom: 2,
        display: "flex",
        flexDirection: "row",
    },
    bulletPoint: {
        width: 8,
        marginRight: 6,
    },
    descriptionText: {
        flex: 1,
        textAlign: "justify",
    },
});
