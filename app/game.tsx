import { useLocalSearchParams, useRouter } from "expo-router";

export default function GameEntry() {
  const { major } = useLocalSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (major === "Information Technology") {
      router.replace("/majors/it");
    } else {
      alert("Mini-game for " + major + " coming soon!");
      router.replace("/");
    }
  }, [major]);

  return null;
}
