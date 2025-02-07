import { Text, View } from "@react-pdf/renderer";
import { ExperienceData } from "@/components/sections/04-Experience/types";
import { styles } from "../../02-CVStyles";

interface ExperienceSectionProps {
  experience: ExperienceData;
  showTitle?: boolean;
}

export default function ExperienceSection({
  experience,
  showTitle = true,
}: ExperienceSectionProps) {
  return (
    <View style={styles.section}>
      {showTitle && (
        <>
          <Text style={styles.sectionTitle}>{experience.title}</Text>
          <View style={styles.separator} />
        </>
      )}

      <View style={styles.experienceContainer}>
        {experience.experiences.map((exp, index) => (
          <View
            key={index}
            style={[
              styles.experienceItem,
              index % 2 === 0 ? styles.leftColumn : styles.rightColumn,
            ]}
          >
            <View style={styles.experienceHeader}>
              <Text style={styles.roleCompany}>
                {exp.role} • {exp.company}
              </Text>
              <Text style={styles.periodLocation}>
                {exp.period} | {exp.location}
              </Text>
            </View>

            <View style={styles.descriptionList}>
              {exp.description.map((desc, i) => (
                <View key={i} style={styles.descriptionItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.descriptionText}>{desc}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
