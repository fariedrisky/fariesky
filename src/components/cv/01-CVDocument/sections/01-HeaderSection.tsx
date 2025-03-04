import { Text, View, Link } from "@react-pdf/renderer";
import { ProfileData } from "@/components/sections/01-Profile/types";
import { links } from "@/components/sections/10-Links/data";
import { styles } from "../../02-CVStyles";

interface HeaderSectionProps {
  profile: ProfileData;
}

export default function HeaderSection({ profile }: HeaderSectionProps) {
  const linkedInUrl =
    links.links.find((link) => link.title === "LinkedIn")?.url || "";
  const websiteUrl = "fariesky.vercel.app";

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.contact}>
        {profile.location} | {profile.phone} |{" "}
        <Link src={`mailto:${profile.email}`} style={styles.link}>
          {profile.email}
        </Link>{" "}
        |{" "}
        <Link src={`https://${websiteUrl}`} style={styles.link}>
          {websiteUrl}
        </Link>
        |{" "}
        <Link src={linkedInUrl} style={styles.link}>
          {linkedInUrl.replace("http://", "").replace("www.", "")}
        </Link>{" "}
      </Text>
    </View>
  );
}
