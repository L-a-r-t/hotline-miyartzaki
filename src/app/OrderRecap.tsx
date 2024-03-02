import validateMenuDelivery from "@/api/admin/validateMenuDelivery"
import { Order } from "@/utils/types"
import { useState } from "react"
import devalidateMenuDelivery from "@/api/admin/devalidateMenuDelivery"
import { entries, values } from "@/utils/functions"

export default function OrderRecap({
  order,
  className,
  showDeliveryButtons,
}: {
  order: Order
  className?: string
  showDeliveryButtons?: boolean
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {entries(order.menus).map(([id, menu]) => (
        <div key={id} className="flex flex-col">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">{menu.name}</h4>
            {showDeliveryButtons ? (
              <MenuDeliveryButton order={order} menuId={id} />
            ) : (
              order.ordertype == "reservation" &&
              order.menus[id].status == "delivered" && (
                <p className="bg-blue-500 text-white font-medium rounded py-1 px-2 text-sm">
                  Livré
                </p>
              )
            )}
          </div>
          {values(menu.content).map((meal) => (
            <div
              key={id + meal.id}
              className="flex items-center justify-between gap-2"
            >
              <p>{meal.name}</p>
              <p className="font-semibold">{meal.qty}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const MenuDeliveryButton = ({
  order,
  menuId,
}: {
  order: Order
  menuId: string
}) => {
  if (order.ordertype != "reservation") return null

  return order.menus[menuId].status == "pending" ? (
    <button
      onClick={() => validateMenuDelivery(order.id, menuId)}
      className="bg-black text-white font-medium rounded py-1 px-2 text-sm"
    >
      Valider la livraison
    </button>
  ) : (
    <div className="flex gap-1">
      <button
        onClick={() => devalidateMenuDelivery(order.id, menuId)}
        className="bg-black text-white font-medium rounded py-1 px-2 text-sm"
      >
        Dé-valider
      </button>
      <p className="bg-blue-500 text-white font-medium rounded py-1 px-2 text-sm">
        Livré
      </p>
    </div>
  )
}
