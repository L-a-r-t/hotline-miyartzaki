import OrderRecap from "@/app/OrderRecap"
import NavWrapper from "@/components/nav"
import { Order } from "@/utils/types"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export default function OrderInPreparationPage({ order }: { order: Order }) {
  return (
    <NavWrapper>
      <div className="flex flex-col gap-8 py-8 px-4 justify-between items-center min-h-screen">
        <header className="flex flex-col md:flex-row md:gap-4 items-center w-full">
          <h1 className="text-4xl font-bold text-center">
            Commande #{order.shortId}
          </h1>
          <p className="px-2 py-1 bg-green-500 text-white rounded text-sm font-medium">
            Acceptée
          </p>
        </header>
        <div className="flex flex-col gap-4 max-w-96 w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Récapitulatif</h2>
          </div>
          {order.type == "hotline" && (
            <div>
              <p>
                Créneau de livraison :
                <br />
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
          <OrderRecap order={order} />
        </div>
        <main className="flex flex-col items-center gap-4 max-w-96">
          <p className="p-2 bg rounded text-justify">
            Tes crêpes arrivent en Shinkansen, prépare ton estomac !
          </p>
          <p className="text-center text-sm -mt-2">
            {order.askedDeliveryTime && (
              <span>
                Ton diner te sera fourni{" "}
                <span className="font-semibold">
                  entre {order.askedDeliveryTime} et{" "}
                  {dayjs(
                    order.type == "diner" ? order.deliveryTime : "00h00",
                    "HH[h]mm"
                  )
                    .add(1, "hour")
                    .format("HH[h]mm")}
                </span>
                , en chambre{" "}
                <span className="font-semibold">{order.chamber}</span>
              </span>
            )}
          </p>
        </main>
      </div>
    </NavWrapper>
  )
}
