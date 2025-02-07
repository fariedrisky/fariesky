import { Text, View } from "@react-pdf/renderer";
import { OrganizationData } from "@/components/sections/07-Organization/types";
import { styles } from "../../02-CVStyles";

interface OrganizationSectionProps {
  organization: OrganizationData;
  showTitle?: boolean;
}

export default function OrganizationSection({
  organization,
  showTitle = true,
}: OrganizationSectionProps) {
  return (
    <View style={styles.section}>
      {showTitle && (
        <>
          <Text style={styles.sectionTitle}>{organization.title}</Text>
          <View style={styles.separator} />
        </>
      )}

      <View style={styles.organizationContainer}>
        {organization.organizations.map((org, index) => (
          <View
            key={index}
            style={[
              styles.organizationItem,
              index % 2 === 0 ? styles.leftColumn : styles.rightColumn,
            ]}
          >
            <View style={styles.organizationHeader}>
              <Text style={styles.roleCompany}>
                {org.role} • {org.name}
              </Text>
              <Text style={styles.periodLocation}>
                {org.period} | {org.location}
              </Text>
            </View>

            <View style={styles.descriptionList}>
              {org.description.map((desc, i) => (
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
