import { onDocumentCreated } from "firebase-functions/v2/firestore"
import { firestore } from "../config/firebase"

export const onMenuCreated = onDocumentCreated(
  {
    document: "menus/{menuId}",
    region: "europe-west1",
  },
  (event: { params: { menuId: any } }) => {
    const menuId = event.params?.menuId
    firestore().doc(`menus/${menuId}`).update({
      id: menuId,
    })
  }
)
