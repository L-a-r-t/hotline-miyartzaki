"use client"

import getOngoingOrders from "@/api/admin/getOngoingOrders"
import { HotlineDevlieryOption, Order } from "@/utils/types"
import { Tab } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import AdminOrderItem from "./OrderItem"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { firestore } from "@/config/firebase"
import useAuth from "@/hooks/auth"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import Link from "next/link"
import { dayjsFromYYYYMMDD, entries, values } from "@/utils/functions"
import getDeliveryOptions from "@/api/client/getDeliveryOptions"

dayjs.extend(customParseFormat)

export default function AdminOrdersPage() {
  const user = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  // const { data, isLoading } = useQuery({
  //   queryKey: ["ongoingOrders"],
  //   queryFn: () => getOngoingOrders(),
  // })

  const [placeFilter, setPlaceFilter] = useState<string[]>([])

  const mealsSummary = useMemo(
    () =>
      values(
        orders.reduce((acc, order) => {
          if (order.status == "cancelled") return acc
          entries(order.menus).forEach(([menuId, menu]) => {
            if (
              order.ordertype == "reservation" &&
              order.menus[menuId].status == "delivered"
            )
              return
            values(menu.content).forEach((meal) => {
              if (!acc[meal.id]) acc[meal.id] = { ...meal, sum: 0 }
              acc[meal.id].sum += meal.qty
            })
          })
          return acc
        }, {} as Record<string, { id: string; name: string; sum: number }>)
      ).sort((a, b) => b.sum - a.sum),
    [orders]
  )

  const totalPrices = useMemo(
    () =>
      Math.round(
        orders.reduce((acc, order) => {
          acc += order.price
          return acc
        }, 0) * 100
      ) / 100,
    [orders]
  )

  const totalPaid = useMemo(
    () =>
      Math.round(
        orders.reduce((acc, order) => {
          if (order.status !== "pending" && order.status !== "cancelled")
            acc += order.price
          return acc
        }, 0) * 100
      ) / 100,
    [orders]
  )

  const runningOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["pending", "preparation", "delivery"].includes(order.status)
      ),
    [orders]
  )

  const unpaidOrders = useMemo(
    () => orders.filter((order) => order.status === "pending"),
    [orders]
  )

  const preparationOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["preparation", "delivery"].includes(order.status)
      ),
    [orders]
  )

  const cancelledOrders = useMemo(
    () => orders.filter((order) => order.status === "cancelled"),
    [orders]
  )

  const deliveredOrders = useMemo(
    () => orders.filter((order) => order.status === "delivered"),
    [orders]
  )

  const deliveryOptions: HotlineDevlieryOption[] = [
    {
      type: "residence",
      place: "Jean d'Ormesson",
    },
    {
      type: "residence",
      place: "Alexandre Manceau",
    },
    {
      type: "residence",
      place: "UXCO",
    },
    {
      type: "residence",
      place: "ALJT",
    },
    {
      type: "residence",
      place: "ASS",
    },
    {
      type: "residence",
      place: "Georges Sand",
    },
    {
      type: "residence",
      place: "Kley",
    },
    {
      type: "residence",
      place: "Twenty Gif",
    },
    {
      type: "residence",
      place: "Twenty Palaiseau",
    },
    {
      type: "city",
      place: "Palaiseau",
    },
    {
      type: "city",
      place: "Massy",
    },
    {
      type: "city",
      place: "Orsay",
    },
    {
      type: "city",
      place: "Gif-sur-Yvette",
    },
    {
      type: "city",
      place: "Bures-sur-Yvette",
    },
  ]

  useEffect(() => {
    if (!user) return
    console.log(dayjs("12h", "HH[h]").format("DD/MM/YYYY HH[h]mm"))
    const q = query(collection(firestore, "orders"))
    // Seigneur pardonnez-moi pour le code qui suit
    // [R] j'ai essayé de recoder ça, j'avoue, j'ai pas vrm réussi là :o X(

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let orders = querySnapshot.docs.map((doc) => doc.data() as Order)

      orders.sort((a, b) =>
        a.type == "hotline" && b.type == "hotline"
          ? dayjs(a.delivery.deliveryTime!, "HH[h]mm").valueOf() -
            dayjs(b.delivery.deliveryTime!, "HH[h]mm").valueOf()
          : 0
      )

      setOrders(orders)
      /**orders.sort((a, b) => parseInt(a.chamber ?? "NaN") - parseInt(b.chamber ?? "NaN"))
      orders.sort(
        (a, b) => a.askedDeliveryTime && b.askedDeliveryTime ?
         dayjs(a.askedDeliveryTime, a.askedDeliveryTime?.length == 5 ? "HH[h]mm" : "HH[h]").valueOf()
          - dayjs(b.askedDeliveryTime, b.askedDeliveryTime?.length == 5 ? "HH[h]mm" : "HH[h]").valueOf() : 0)
      setOrders(orders)**/

      /**let ordersWithDeliveryTime = orders.filter(order => order.askedDeliveryTime)
       let ordersWithoutDeliveryTime = orders.filter(order => !order.askedDeliveryTime)

       ordersWithDeliveryTime = ordersWithDeliveryTime.sort(
       (a, b) =>
       dayjs(a.reservationTime.seconds).valueOf() -
       dayjs(b.reservationTime.seconds).valueOf()
       )
       ordersWithDeliveryTime = ordersWithDeliveryTime.sort((a, b) => {
       const delta =
       dayjs(
       a.askedDeliveryTime,
       a.askedDeliveryTime?.length == 5 ? "HH[h]mm" : "HH[h]"
       ).valueOf() -
       dayjs(
       b.askedDeliveryTime,
       b.askedDeliveryTime?.length == 5 ? "HH[h]mm" : "HH[h]"
       ).valueOf()
       return delta === 0
       ? dayjs(a.reservationTime.seconds).valueOf() -
       dayjs(b.reservationTime.seconds).valueOf()
       : delta
       })
       ordersWithoutDeliveryTime = ordersWithoutDeliveryTime.sort(
       (a, b) =>
       dayjs(a.reservationTime.seconds).valueOf() -
       dayjs(b.reservationTime.seconds).valueOf()
       )
       orders = [...ordersWithoutDeliveryTime, ...ordersWithDeliveryTime.reverse()]**/
    })
    return () => unsubscribe()
  }, [user])

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:justify-between items-center p-4 lg:p-8">
        <h1 className="text-4xl font-bold">Commandes</h1>
        <p className="p-2 rounded bg text-sm">
          <span className="font-semibold">{totalPaid}€</span> encaissés sur{" "}
          <span className="font-semibold">{totalPrices}€</span> de commandes en
          cours
        </p>
        {/* <Link
          href="/admin/orders/create"
          className="bg-black text-white p-4 rounded font-semibold"
        >
          + Créer une commande
        </Link> */}
      </div>
      <Tab.Group>
        <Tab.List className="flex flex-col lg:flex-row px-4 lg:px-8 gap-4">
          <Tab className="rounded-xl p-2 px-4 ui-selected:bg-black ui-selected:text-white font-semibold">
            Livraison en cours
          </Tab>
          <Tab className="rounded-xl p-2 px-4 ui-selected:bg-black ui-selected:text-white font-semibold">
            À venir
          </Tab>
          <Tab className="rounded-xl p-2 px-4 ui-selected:bg-black ui-selected:text-white font-semibold">
            Tout
          </Tab>
          <Tab className="rounded-xl p-2 px-4 ui-selected:bg-black ui-selected:text-white font-semibold">
            En attente de paiement
          </Tab>
          <Tab className="rounded-xl p-2 px-4 ui-selected:bg-black ui-selected:text-white font-semibold">
            Préparation / Livraison
          </Tab>
          <Tab className="rounded-xl p-2 px-4 ui-selected:bg-black ui-selected:text-white font-semibold">
            Annulées
          </Tab>
          <Tab className="rounded-xl p-2 px-4 ui-selected:bg-black ui-selected:text-white font-semibold">
            Terminées
          </Tab>
        </Tab.List>
        <Tab.Panels className="flex flex-col-reverse lg:flex-row gap-8 h-full p-4 lg:px-8 flex-grow">
          <Tab.Panel className="flex-[2]">
            <div className="flex flex-col gap-4">
              {values(deliveryOptions).map((option) => (
                <button
                  key={option.place}
                  onClick={() => {
                    if (placeFilter.includes(option.place))
                      setPlaceFilter(
                        placeFilter.filter((p) => p !== option.place)
                      )
                    else setPlaceFilter([...placeFilter, option.place])
                  }}
                  className={`p-2 rounded bg-opacity-80 backdrop-blur-sm hover:bg-opacity-95 text-sm ${
                    placeFilter.includes(option.place)
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {option.place} (
                  {
                    runningOrders.filter(
                      (o) =>
                        o.day == "2024-03-03" &&
                        o.type == "hotline" &&
                        ((o.delivery.type === "city" &&
                          o.delivery.city == option.place) ||
                          (o.delivery.type === "residence" &&
                            o.delivery.residence == option.place))
                    ).length
                  }{" "}
                  crêpes)
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {runningOrders
                .filter(
                  (o) =>
                    o.type == "hotline" &&
                    placeFilter.includes(
                      // @ts-ignore
                      o.delivery.city ?? o.delivery.residence
                    )
                )
                .map((order) => (
                  <AdminOrderItem key={order.id} order={order} />
                ))}
            </div>
          </Tab.Panel>
          <Tab.Panel className="flex-[2]">
            <div className="flex flex-col gap-4">
              {runningOrders.map((order) => (
                <AdminOrderItem key={order.id} order={order} />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel className="flex-[2]">
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <AdminOrderItem key={order.id} order={order} />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel className="flex-[2]">
            <div className="flex flex-col gap-4">
              {unpaidOrders.map((order) => (
                <AdminOrderItem key={order.id + "unpaid"} order={order} />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel className="flex-[2]">
            <div className="flex flex-col gap-4">
              {preparationOrders.map((order) => (
                <AdminOrderItem key={order.id + "prepar"} order={order} />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel className="flex-[2]">
            <div className="flex flex-col gap-4">
              {cancelledOrders.map((order) => (
                <AdminOrderItem key={order.id + "cancel"} order={order} />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel className="flex-[2]">
            <div className="flex flex-col gap-4">
              {deliveredOrders.map((order) => (
                <AdminOrderItem key={order.id + "delive"} order={order} />
              ))}
            </div>
          </Tab.Panel>
          <div className="flex-[1] relative p-4 rounded-xl shadow-xl shadow-blue-950/5 bg">
            <div className="sticky top-8 flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold text-center">
                Commandes en cours
              </h2>
              <div className="flex flex-col gap-2 px-4 w-full">
                {mealsSummary.map((meal) => (
                  <div
                    key={meal.id + "summary"}
                    className="w-full flex justify-between items-center"
                  >
                    <p>{meal.name}</p>
                    <p className="font-bold">{meal.sum}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}
