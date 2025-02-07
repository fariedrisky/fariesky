import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: "40 40",
    fontFamily: "LibreBaskerville",
    backgroundColor: "#FFFFFF",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: "LibreBaskerville",
    fontStyle: "bold",
    fontWeight: 700,
    marginBottom: 8,
    color: "#000000",
  },
  contact: {
    fontSize: 9.0,
    fontFamily: "LibreBaskerville",
    color: "#000000",
    lineHeight: 1.4,
  },
  link: {
    color: "#000000",
    textDecoration: "underline",
  },
  descriptionContainer: {
    marginTop: 4,
  },
  description: {
    fontSize: 9.5,
    fontFamily: "LibreBaskerville",
    lineHeight: 1.5,
    color: "#000000",
    textAlign: "justify",
    paddingRight: 2,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "LibreBaskerville",
    fontWeight: 700,
    fontStyle: "bold",
    marginBottom: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginBottom: 8,
  },
  skillsText: {
    fontSize: 9.5,
    fontFamily: "LibreBaskerville",
    lineHeight: 1.5,
    color: "#000000",
  },
  // Common styles for column layout
  leftColumn: {
    marginRight: "6%",
  },
  rightColumn: {
    marginLeft: 0,
  },
  // Experience styles
  experienceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  experienceItem: {
    width: "47%",
    marginBottom: 16,
    paddingRight: 15,
  },
  experienceHeader: {
    marginBottom: 6,
  },
  roleCompany: {
    fontSize: 12,
    fontFamily: "LibreBaskerville",
    fontWeight: 700,
    fontStyle: "bold",
    marginBottom: 4,
  },
  periodLocation: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    marginBottom: 4,
  },
  descriptionList: {
    marginTop: 4,
  },
  descriptionItem: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    lineHeight: 1.5,
    marginBottom: 3,
    display: "flex",
    flexDirection: "row",
  },
  bulletPoint: {
    width: 10,
    marginRight: 8,
  },
  descriptionText: {
    flex: 1,
    textAlign: "justify",
  },
  // Education styles
  educationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  educationItem: {
    width: "47%",
    marginBottom: 16,
    paddingRight: 15,
  },
  educationHeader: {
    marginBottom: 6,
  },
  schoolName: {
    fontSize: 12,
    fontFamily: "LibreBaskerville",
    fontWeight: 700,
    fontStyle: "bold",
    marginBottom: 4,
  },
  degreeText: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    marginBottom: 2,
  },
  scoreText: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    marginTop: 2,
  },
  // Organization specific styles
  organizationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  organizationItem: {
    width: "47%",
    marginBottom: 16,
    paddingRight: 15,
  },
  organizationHeader: {
    marginBottom: 6,
  },
  organizationLogo: {
    width: 40,
    height: 40,
    marginBottom: 4,
    objectFit: "contain",
  },
  organizationName: {
    fontSize: 12,
    fontFamily: "LibreBaskerville",
    fontWeight: 700,
    fontStyle: "bold",
    marginBottom: 4,
  },
  organizationRole: {
    fontSize: 10,
    fontFamily: "LibreBaskerville",
    marginBottom: 2,
  },
  organizationPeriodLocation: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    marginBottom: 4,
    color: "#666666",
  },
  organizationDescriptionList: {
    marginTop: 4,
  },
  organizationDescriptionItem: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    lineHeight: 1.5,
    marginBottom: 3,
    display: "flex",
    flexDirection: "row",
  },
  // Course specific styles
  courseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  courseItem: {
    width: "47%",
    marginBottom: 16,
    paddingRight: 15,
  },
  courseHeader: {
    marginBottom: 6,
  },
  courseTitle: {
    fontSize: 12,
    fontFamily: "LibreBaskerville",
    fontWeight: 700,
    fontStyle: "bold",
    marginBottom: 4,
  },
  courseLogo: {
    width: 40,
    height: 40,
    marginBottom: 4,
    objectFit: "contain",
  },
  courseProvider: {
    fontSize: 10,
    fontFamily: "LibreBaskerville",
    marginBottom: 2,
  },
  coursePeriodLocation: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    marginBottom: 4,
    color: "#666666",
  },
  courseDescriptionList: {
    marginTop: 4,
  },
  courseDescriptionItem: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    lineHeight: 1.5,
    marginBottom: 3,
    display: "flex",
    flexDirection: "row",
  },
  certificateLink: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    color: "#0000EE",
    textDecoration: "underline",
    marginTop: 2,
  },
  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  languageItem: {
    width: "47%",
    marginBottom: 16,
    paddingRight: 15,
  },
  languageHeader: {
    marginBottom: 6,
  },
  languageName: {
    fontSize: 12,
    fontFamily: "LibreBaskerville",
    fontWeight: 700,
    fontStyle: "bold",
    marginBottom: 4,
  },
  languageLevel: {
    fontSize: 9,
    fontFamily: "LibreBaskerville",
    color: "#666666",
  },
});
