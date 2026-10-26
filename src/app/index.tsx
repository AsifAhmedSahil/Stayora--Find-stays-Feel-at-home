import { Redirect } from "expo-router";
import { useSession } from "@/lib/auth/session";
//update
export default function Index() {
  const { isSignedIn } = useSession();

  return <Redirect href={isSignedIn ? "/home" : "/onboarding"} />;
}

// update