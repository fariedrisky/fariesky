import { Text, View } from "@react-pdf/renderer";
import { AboutData } from "@/components/sections/02-About/types";
import { styles } from "../../02-CVStyles";

interface AboutSectionProps {
  about: AboutData;
}

export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <View style={styles.descriptionContainer}>
      <Text style={styles.description}>{about.description}</Text>
    </View>
  );
}
