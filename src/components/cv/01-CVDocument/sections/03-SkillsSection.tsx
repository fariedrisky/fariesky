import { Text, View } from "@react-pdf/renderer";
import { SkillsData } from "@/components/sections/03-Skills/types";
import { styles } from "../../02-CVStyles";

interface SkillsSectionProps {
  skills: SkillsData;
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{skills.title}</Text>
      <View style={styles.separator} />
      <Text style={styles.skillsText}>{skills.skills.join(", ")}</Text>
    </View>
  );
}
