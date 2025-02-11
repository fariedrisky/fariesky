import { Text, View } from "@react-pdf/renderer";
import { styles } from "../../02-CVStyles";
import { education } from "@/components/sections/06-Education/data";

export default function EducationSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{education.title}</Text>
      <View style={styles.separator} />

      <View style={styles.educationContainer}>
        {education.educations.map((edu, index) => (
          <View key={index} style={styles.educationItem}>
            <View style={styles.educationHeader}>
              <View style={styles.mainInfo}>
                <Text style={styles.school}>{edu.school}</Text>
                <Text style={styles.degree}>{edu.degree}</Text>
              </View>
              <View style={styles.locationPeriodContainer}>
                <Text style={styles.location}>{edu.location}</Text>
                <Text style={styles.period}>{edu.period}</Text>
              </View>
            </View>

            {edu.score && (
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>{edu.score}</Text>
              </View>
            )}

            {edu.description && (
              <View style={styles.descriptionList}>
                {edu.description.map((desc, i) => (
                  <View key={i} style={styles.descriptionItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.descriptionText}>{desc}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
