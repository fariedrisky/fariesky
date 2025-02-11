import { Text, View } from "@react-pdf/renderer";
import { styles } from "../../02-CVStyles";
import { experience } from "@/components/sections/04-Experience/data";

export default function ExperienceSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{experience.title}</Text>
      <View style={styles.separator} />

      <View style={styles.experienceContainer}>
        {experience.experiences.map((exp, index) => (
          <View key={index} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <View style={styles.mainInfo}>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.role}>{exp.role}</Text>
              </View>
              <View style={styles.locationPeriodContainer}>
                <Text style={styles.location}>{exp.location}</Text>
                <Text style={styles.period}>{exp.period}</Text>
              </View>
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
