import { onDocumentCreated } from "firebase-functions/v2/firestore"
import { firestore } from "../config/firebase"

export const onMealCreated = onDocumentCreated(
  { document: "meals/{mealId}", region: "europe-west1" },
  (event: { params: { mealId: any } }) => {
    const mealId = event.params?.mealId
    firestore().doc(`meals/${mealId}`).update({
      id: mealId,
    })
  }
)
