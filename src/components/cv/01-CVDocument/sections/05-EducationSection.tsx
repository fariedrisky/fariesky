import { Text, View } from "@react-pdf/renderer";
import { EducationData } from "@/components/sections/06-Education/types";
import { styles } from "../../02-CVStyles";

interface EducationSectionProps {
  education: EducationData;
  showTitle?: boolean;
}

export default function EducationSection({
  education,
  showTitle = true,
}: EducationSectionProps) {
  return (
    <View style={styles.section}>
      {showTitle && (
        <>
          <Text style={styles.sectionTitle}>{education.title}</Text>
          <View style={styles.separator} />
        </>
      )}

      <View style={styles.educationContainer}>
        {education.educations.map((edu, index) => (
          <View
            key={index}
            style={[
              styles.educationItem,
              index % 2 === 0 ? styles.leftColumn : styles.rightColumn,
            ]}
          >
            <View style={styles.educationHeader}>
              <Text style={styles.schoolName}>{edu.school}</Text>
              <Text style={styles.periodLocation}>
                {edu.period} | {edu.location}
              </Text>
              <Text style={styles.degreeText}>{edu.degree}</Text>
              {edu.score && <Text style={styles.scoreText}>{edu.score}</Text>}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
