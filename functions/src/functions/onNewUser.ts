import { user } from "firebase-functions/v1/auth"
import { firestore } from "../config/firebase"

export const onNewUser = user().onCreate(async (user) => {
  // auth().updateUser(user.uid, {
  //   displayName: firstName[0].toUpperCase() + firstName.slice(1),
  // })
  firestore().doc(`users/${user.uid}`).set({
    // firstName: firstName[0].toUpperCase() + firstName.slice(1),
    // lastName: lastName[0].toUpperCase() + lastName.slice(1),
    phone: user.phoneNumber,
    orders: [],
  })
})
