"use client"

import getUserOrders from "@/api/client/getUserOrders"
import NavWrapper from "@/components/nav"
import { Order } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import Link from "next/link"
import useAuth from "@/hooks/auth"
import OrderStatusBadge from "@/app/OrderStatus"
import Spinner from "@/components/spinner"
import "dayjs/locale/fr"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export default function AccountOrdersPage() {
  useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ["order"],
    queryFn: () => getUserOrders(),
  })

  useEffect(() => {
    if (!data) return
    setOrders(
      data.sort((a, b) => b.reservationTime.seconds - a.reservationTime.seconds)
    )
  }, [data])

  return (
    <NavWrapper>
      <main className="flex flex-col items-center min-h-screen py-8 px-4 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Mes commandes</h1>
        {isLoading && (
          <div className="flex py-4 justify-center items-center">
            <Spinner big className="border-black" />
          </div>
        )}
        {!isLoading && orders.length === 0 && (
          <p>Tu n'as pas encore passé de commande :(</p>
        )}
        <div className="flex flex-col items-center w-full gap-4 max-w-96">
          {orders.map((order) => (
            <Link
              href={"/order/" + order.id}
              key={order.id}
              className="p-4 w-full rounded-lg shadow-xl shadow-blue-950/5 bg"
            >
              <p className="font-semibold">
                Commande #{order.shortId} -{" "}
                {dayjs(order.day, "YYYY-MM-DD").locale("fr").format("DD MMMM")}
              </p>
              <div className="flex justify-between items-center">
                <OrderStatusBadge status={order.status} />
                <p>{order.price}€</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </NavWrapper>
  )
}
