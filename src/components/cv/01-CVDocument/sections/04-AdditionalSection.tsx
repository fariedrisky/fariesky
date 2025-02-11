import { Text, View } from "@react-pdf/renderer";
import { styles } from "../../02-CVStyles";
import { skills } from "@/components/sections/03-Skills/data";
import { languages } from "@/components/sections/09-Languages/data";
import { course } from "@/components/sections/08-Course-Training/data";

export default function AdditionalSection() {
  // Helper functions tetap sama
  const formatSkills = (skills: string[]): string => {
    return skills.join(", ");
  };

  const formatLanguages = (
    languages: { name: string; level: string }[],
  ): string => {
    return languages.map((lang) => `${lang.name} (${lang.level})`).join(", ");
  };

  const formatCertifications = (
    courses: Array<{ name: string; provider: string }>,
  ): string => {
    return courses
      .map((course) => `${course.name} - ${course.provider}`)
      .join("; ");
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ADDITIONAL</Text>
      <View style={styles.separator} />

      <View style={styles.additionalContainer}>
        {/* Technical Skills */}
        <View style={styles.additionalItem}>
          <Text>
            <Text style={styles.itemTitle}>Technical Skills: </Text>
            <Text style={styles.itemContent}>
              {formatSkills(skills.skills)}
            </Text>
          </Text>
        </View>

        {/* Languages */}
        <View style={styles.additionalItem}>
          <Text>
            <Text style={styles.itemTitle}>Languages: </Text>
            <Text style={styles.itemContent}>
              {formatLanguages(languages.languages)}
            </Text>
          </Text>
        </View>

        {/* Certifications & Training */}
        <View style={styles.additionalItem}>
          <Text>
            <Text style={styles.itemTitle}>Certifications & Training: </Text>
            <Text style={styles.itemContent}>
              {formatCertifications(course.courses)}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
