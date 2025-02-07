// components/cv/CVDocument.tsx
import { Document, Page, Text, View, Font, Link } from "@react-pdf/renderer";
import { ProfileData } from "@/components/sections/01-Profile/types";
import { about } from "@/components/sections/02-About/data";
import { links } from "../sections/10-Links/data";
import { styles } from "./CVStyles";

// Font registration
const fonts = [
  {
    family: "LibreBaskerville",
    format: "truetype",
    src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/LibreBaskerville-Regular.ttf`,
    fontWeight: 400,
    fontStyle: "normal",
  },
  {
    family: "LibreBaskerville",
    format: "truetype",
    src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/LibreBaskerville-Bold.ttf`,
    fontWeight: 700,
    fontStyle: "bold",
  },
  {
    family: "LibreBaskerville",
    format: "truetype",
    src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/LibreBaskerville-Italic.ttf`,
    fontWeight: 400,
    fontStyle: "italic",
  },
] as const;

// Register fonts
fonts.forEach((font) => Font.register(font));

interface CVDocumentProps {
  profile: ProfileData;
}

export const CVDocument: React.FC<CVDocumentProps> = ({ profile }) => {
  // Find LinkedIn URL from links data
  const linkedInUrl =
    links.links.find((link) => link.title === "LinkedIn")?.url || "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.contact}>
            {profile.location} | {profile.phone} |{" "}
            <Link src={`mailto:${profile.email}`} style={styles.link}>
              {profile.email}
            </Link>{" "}
            |{" "}
            <Link src={linkedInUrl} style={styles.link}>
              {linkedInUrl.replace("http://", "").replace("www.", "")}
            </Link>
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{about.description}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default CVDocument;
