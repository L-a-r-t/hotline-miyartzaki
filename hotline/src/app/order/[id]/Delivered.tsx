import OrderRecap from "@/app/OrderRecap"
import NavWrapper from "@/components/nav"
import { Order } from "@/utils/types"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export default function DeliveredOrderPage({ order }: { order: Order }) {
  return (
    <NavWrapper>
      <div className="flex flex-col gap-8 py-8 px-4 justify-between items-center min-h-screen">
        <header className="flex flex-col md:flex-row md:gap-4 items-center w-full">
          <h1 className="text-4xl font-bold text-center">
            Commande #{order.shortId}
          </h1>
          <p className="px-2 py-1 bg-blue-500 text-white rounded text-sm font-medium">
            Livrée
          </p>
        </header>
        <div className="flex flex-col gap-4 max-w-96 w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Récapitulatif</h2>
          </div>
          {order.type == "hotline" && (
            <div>
              <p>
                Créneau de livraison : <br />
                <span className="font-semibold">
                  Entre {order.delivery.deliveryTime} et{" "}
                  {(order.delivery.deliveryTime.length > 3
                    ? dayjs(order.delivery.deliveryTime, "HH[h]mm")
                    : dayjs(order.delivery.deliveryTime, "HH[h]")
                  )
                    .add(1, "hour")
                    .format("HH[h]mm")}
                </span>
              </p>
              <p>
                Lieu de livraison : <br />
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
          <OrderRecap order={order} />
        </div>
        <main className="flex flex-col items-center gap-4 max-w-96">
          <p className="p-2 bg rounded text-justify">
            Mmmmmmh... C'est bon hein ? On espère que tu t'es régalé·e !
          </p>
        </main>
      </div>
    </NavWrapper>
  )
}
