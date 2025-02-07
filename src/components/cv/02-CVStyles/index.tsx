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
  leftColumn: {
    marginRight: "6%",
  },
  rightColumn: {
    marginLeft: 0,
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
  // Education specific styles
  educationContainer: {
    marginTop: 8,
  },
  educationItem: {
    marginBottom: 12,
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
});
