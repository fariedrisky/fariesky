import { Document, Page, Font } from "@react-pdf/renderer";
import { ProfileData } from "@/components/sections/01-Profile/types";
import { about } from "@/components/sections/02-About/data";
import { skills } from "@/components/sections/03-Skills/data";
import { experience } from "@/components/sections/04-Experience/data";
import { education } from "@/components/sections/06-Education/data";
import { styles } from "../02-CVStyles";

// Import modular sections
import ProfileSection from "./sections/01-ProfileSection";
import AboutSection from "./sections/02-AboutSection";
import SkillsSection from "./sections/03-SkillsSection";
import ExperienceSection from "./sections/04-ExperienceSection";
import EducationSection from "./sections/05-EducationSection";
import { fonts } from "../02-CVStyles/fonts";

fonts.forEach((font) => Font.register(font));

interface CVDocumentProps {
  profile: ProfileData;
}

export default function CVDocument({ profile }: CVDocumentProps) {
  // Calculate experiences for each page (assuming 4 experiences fit on first page)
  const firstPageExperiences = experience.experiences.slice(0, 4);
  const remainingExperiences = experience.experiences.slice(4);

  return (
    <Document>
      {/* First Page */}
      <Page size="A4" style={styles.page}>
        <ProfileSection profile={profile} />
        <AboutSection about={about} />
        <SkillsSection skills={skills} />
        <ExperienceSection
          experience={{
            title: experience.title,
            experiences: firstPageExperiences,
          }}
          showTitle={true}
        />
      </Page>

      {/* Second Page for remaining experiences and education */}
      {remainingExperiences.length > 0 && (
        <Page size="A4" style={styles.page}>
          <ExperienceSection
            experience={{
              title: experience.title,
              experiences: remainingExperiences,
            }}
            showTitle={false}
          />
          <EducationSection education={education} />
        </Page>
      )}

      {/* If no remaining experiences, put education on first page */}
      {remainingExperiences.length === 0 && (
        <Page size="A4" style={styles.page}>
          <EducationSection education={education} />
        </Page>
      )}
    </Document>
  );
}
