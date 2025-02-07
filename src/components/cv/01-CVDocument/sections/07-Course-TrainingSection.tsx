import { Text, View } from "@react-pdf/renderer";
import { CourseData } from "@/components/sections/08-Course-Training/types";
import { styles } from "../../02-CVStyles";

interface CourseTrainingSectionProps {
  course: CourseData;
  showTitle?: boolean;
}

export default function CourseTrainingSection({
  course,
  showTitle = true,
}: CourseTrainingSectionProps) {
  return (
    <View style={styles.section}>
      {showTitle && (
        <>
          <Text style={styles.sectionTitle}>{course.title}</Text>
          <View style={styles.separator} />
        </>
      )}

      <View style={styles.courseContainer}>
        {course.courses.map((item, index) => (
          <View
            key={index}
            style={[
              styles.courseItem,
              index % 2 === 0 ? styles.leftColumn : styles.rightColumn,
            ]}
          >
            <View style={styles.courseHeader}>
              <Text style={styles.courseTitle}>
                {item.name} • {item.provider}
              </Text>
              <Text style={styles.periodLocation}>
                {item.period} | {item.location}
              </Text>
            </View>

            <View style={styles.descriptionList}>
              {item.description.map((desc, i) => (
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
