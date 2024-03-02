import { onDocumentUpdated } from "firebase-functions/v2/firestore"
import { Order } from "../types"
import { firestore } from "../config/firebase"

export const onOrderUpdate = onDocumentUpdated(
  { document: "orders/{orderId}", region: "europe-west1" },
  async (event) => {
    const before = event.data?.before.data() as Order
    const after = event.data?.after.data() as Order

    // if (
    //   before.status != "cancelled" &&
    //   after.status == "cancelled" &&
    //   after.type == "diner2"
    // ) {
    //   const deliveryOptions = (
    //     await firestore().doc(`global/delivery`).get()
    //   ).data() as Record<string, any[]>
    //   if (!deliveryOptions) throw "no delivery options found."
    //   const deliveryOptionIndex = Object.values(
    //     deliveryOptions[after.day ?? ""]
    //   ).findIndex((option) => option.hour == after.deliveryTime)
    //   Object.values(after.menus).forEach((menu) => {
    //     if (menu.type != "diner") return
    //     firestore()
    //       .doc(`global/delivery`)
    //       .update({
    //         [`${after.day}.options.${deliveryOptionIndex}.stock`]:
    //           firestore.FieldValue.increment(1),
    //       })
    //   })
    //   return
    // }

    if (
      before.status != "delivered" &&
      Object.values(after.menus).every((menu) => menu.status == "delivered")
    ) {
      await firestore().doc(`orders/${event.params?.orderId}`).update({
        status: "delivered",
      })
    }
    if (
          before.status == "delivered" &&
          Object.values(after.menus).some((menu) => menu.status == "delivered")
      ) {
          await firestore().doc(`orders/${event.params?.orderId}`).update({
              status: "preparation",
          })
      }
  }
)
