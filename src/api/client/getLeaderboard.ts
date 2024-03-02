import { firestore } from "@/config/firebase"
import { Leaderboard } from "@/utils/types/codes"
import { doc, getDoc } from "firebase/firestore"

export default async function getLeaderboard() {
  const res = await getDoc(doc(firestore, "global", "leaderboard"))

  return res.data() as Leaderboard
}
