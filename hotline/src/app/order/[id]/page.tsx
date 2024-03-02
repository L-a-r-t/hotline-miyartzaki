"use client"

import getOrder from "@/api/client/getOrder"
import { Order, ReservationData } from "@/utils/types"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import PendingOrderPage from "./Pending"
import OrderInPreparationPage from "./Preparation"
import { useQuery } from "@tanstack/react-query"
import useAuth from "@/hooks/auth"
import DeliveredOrderPage from "./Delivered"
import CancelledOrderPage from "./Cancelled"
import Spinner from "@/components/spinner"
import { doc, onSnapshot } from "firebase/firestore"
import { firestore } from "@/config/firebase"

export default function OrderPage() {
  useAuth()
  const { id } = useParams()
  const [order, setOrder] = useState<Order>()

  useEffect(() => {
    if (!id) return
    const unsubscribe = onSnapshot(
      doc(firestore, "orders", id as string),
      (doc) => {
        setOrder(doc.data() as Order)
      }
    )
    return unsubscribe
  }, [id])

  if (!order)
    return (
      <div className="flex min-h-screen justify-center items-center">
        <Spinner big className="border-black" />
      </div>
    )

  if (order.status === "pending") return <PendingOrderPage order={order} />

  if (order.status === "preparation")
    return <OrderInPreparationPage order={order} />

  if (order.status === "delivered") return <DeliveredOrderPage order={order} />

  if (order.status === "cancelled") return <CancelledOrderPage order={order} />

  return <div>Unknown order status</div>
}
