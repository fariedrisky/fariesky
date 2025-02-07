import { Text, View } from "@react-pdf/renderer";
import { LanguageData } from "@/components/sections/09-Languages/types";
import { styles } from "../../02-CVStyles";

interface LanguagesSectionProps {
  languages: LanguageData;
  showTitle?: boolean;
}

export default function LanguagesSection({
  languages,
  showTitle = true,
}: LanguagesSectionProps) {
  return (
    <View style={styles.section}>
      {showTitle && (
        <>
          <Text style={styles.sectionTitle}>{languages.title}</Text>
          <View style={styles.separator} />
        </>
      )}

      <View style={styles.languageContainer}>
        {languages.languages.map((lang, index) => (
          <View
            key={index}
            style={[
              styles.languageItem,
              index % 2 === 0 ? styles.leftColumn : styles.rightColumn,
            ]}
          >
            <View style={styles.languageHeader}>
              <Text style={styles.languageName}>{lang.name}</Text>
              <Text style={styles.languageLevel}>{lang.level}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
