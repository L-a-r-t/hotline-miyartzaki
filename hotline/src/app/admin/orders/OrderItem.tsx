import validateOrderPayment from "@/api/admin/validateOrderPayment"
import OrderRecap from "@/app/OrderRecap"
import OrderStatusBadge from "@/app/OrderStatus"
import { Order } from "@/utils/types"
import dayjs from "dayjs"
import { useState } from "react"
import "dayjs/locale/fr"
import customParseFormat from "dayjs/plugin/customParseFormat"
import rependOrder from "@/api/admin/rependOrder"
import cancelOrder from "@/api/client/cancelOrder"

dayjs.extend(customParseFormat)

export default function AdminOrderItem({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false)
  // const [status, setStatus] = useState(order.status)

  const validatePayment = async () => {
    try {
      setLoading(true)
      await validateOrderPayment(order.id)
      // setStatus("preparation")
    } finally {
      setLoading(false)
    }
  }

  const pendOrder = async () => {
    try {
      setLoading(true)
      await rependOrder(order.id)
      // setStatus("preparation")
    } finally {
      setLoading(false)
    }
  }

  const cancOrder = async () => {
    try {
      setLoading(true)
      await cancelOrder(order.id)
      // setStatus("preparation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 rounded-lg shadow-xl shadow-blue-950/5 bg w-full">
      <div className="flex justify-between items-center font-semibold">
        <div className="flex items-center font-semibold gap-2">
          <h2>Commande #{order.shortId}</h2>
          <p className="text-sm px-1 py-0.5 rounded text-white bg-black">
            {order.price}€
          </p>
        </div>
        {/* {order.day ? (
          <p>{dayjs(order.day, "YYYY-MM-DD").locale("fr").format("DD MMMM")}</p>
        ) : (
          <p>
            {dayjs(order.reservationTime.seconds)
              .locale("fr")
              .format("DD MMMM")}
          </p>
        )} */}
      </div>
      <div className="flex justify-between items-center">
        {order.authorData && (
          <p>
            {order.authorData.firstName} {order.authorData.lastName} (
            {order.authorData.phone})
          </p>
        )}
        <OrderStatusBadge status={order.status} />
      </div>
      {order.type == "diner" && (
        <div className="flex justify-between items-center">
          <p>
            Livraison prévue à{" "}
            <span className="font-semibold">{order.deliveryTime}</span>
          </p>
          <p>
            <span className="font-semibold">{order.deliveryPlace}</span>
          </p>
        </div>
      )}
      {order.type == "hotline" && (
        <div>
          <p>
            Créneau de livraison :
            <br />
            <span className="font-semibold">{order.delivery.deliveryTime}</span>
          </p>
          <p>
            Lieu de livraison :
            <br />
            {order.delivery.type == "residence" ? (
              <>
                <span className="font-semibold">
                  {order.delivery.residence}
                </span>
                <br />
                <span>{order.delivery.chamber}</span>
              </>
            ) : (
              <>
                <span className="font-semibold">{order.delivery.city}</span>
                <br />
                <span>{order.delivery.address}</span>
                <br />
                <span>{order.delivery.address2}</span>
              </>
            )}
          </p>
          {order.delivery.additionalInfo && (
            <p>
              Informations complémentaires :
              <br />
              <span className="font-semibold">
                {order.delivery.additionalInfo}
              </span>
            </p>
          )}
        </div>
      )}
      {order.chamber && (
        <div className="flex justify-between items-center">
          <p>
            Livraison prévue à{" "}
            <span className="font-semibold">{order.askedDeliveryTime}</span>
          </p>
          <p>
            Chambre{" "}
            <span className="font-semibold">
              {parseInt(order.chamber ?? "NaN")} ({order.chamber})
            </span>
          </p>
        </div>
      )}
      <OrderRecap
        order={order}
        showDeliveryButtons={
          ["preparation", "delivered"].includes(order.status) &&
          order.ordertype == "reservation"
        }
        className="pt-4 border-t mt-4 border-gray-300"
      />
      {order.status == "pending" && (
        <div className="flex lg:flex-row">
          <button
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation()
              validatePayment()
            }}
            className="flex-[3] bg-gray-950 text-white font-semibold rounded-s text-center py-2 w-full mt-4"
          >
            Valider le paiement
          </button>
          <button
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation()
              cancOrder()
            }}
            className="flex-[1] border-red-500 border bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-e text-center py-2 w-full mt-4"
          >
            Annuler
          </button>
        </div>
      )}
      {order.status == "cancelled" && (
        <button
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation()
            pendOrder()
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded text-center py-2 w-full mt-4"
        >
          Ré-activer la commande
        </button>
      )}
      {order.status == "preparation" && (
        <button
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation()
            pendOrder()
          }}
          className="border-orange-500 border bg-orange-50 hover:bg-orange-100 text-orange-500 rounded font-semibold text-center py-2 w-full mt-4"
        >
          Invalider le paiement
        </button>
      )}
      {order.status == "preparation" && order.ordertype == "order" && (
        <button
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation()
            validatePayment()
          }}
          className="bg-green-500 text-white font-semibold rounded text-center py-2 w-full mt-4"
        >
          Valider la livraison
        </button>
      )}
    </div>
  )
}
