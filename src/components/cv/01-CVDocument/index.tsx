import { Document, Page, Font } from "@react-pdf/renderer";
import { ProfileData } from "@/components/sections/01-Profile/types";
import { styles } from "../02-CVStyles";
import ProfileSection from "./sections/01-HeaderSection";
import ExperienceSection from "./sections/02-ExperienceSection";
import EducationSection from "./sections/03-EducationSection";
import AdditionalSection from "./sections/04-AdditionalSection";

import { fonts } from "../02-CVStyles/fonts";

fonts.forEach((font) => Font.register(font));

interface CVDocumentProps {
  profile: ProfileData;
}

export default function CVDocument({ profile }: CVDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <ProfileSection profile={profile} />
        <ExperienceSection />
        <EducationSection/>
        <AdditionalSection />
      </Page>
    </Document>
  );
}
