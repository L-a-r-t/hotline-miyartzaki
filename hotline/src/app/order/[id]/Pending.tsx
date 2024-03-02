import cancelOrder from "@/api/client/cancelOrder"
import OrderRecap from "@/app/OrderRecap"
import NavWrapper from "@/components/nav"
import Spinner from "@/components/spinner"
import { Order, ReservationData } from "@/utils/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import Link from "next/link"
import "dayjs/locale/fr"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useRouter } from "next/navigation"

dayjs.extend(customParseFormat)

export default function PendingOrderPage({ order }: { order: Order }) {
  const queryclient = useQueryClient()

  const router = useRouter()

  const { isPending, mutate } = useMutation({
    mutationKey: ["order", order.id],
    mutationFn: () => cancelOrder(order.id),
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["order", order.id],
      })
      router.refresh()
    },
  })

  return (
    <NavWrapper>
      <div className="flex flex-col gap-8 py-8 px-4 justify-between items-center min-h-screen">
        <header className="flex flex-col md:flex-row md:gap-4 items-center w-full">
          <h1 className="text-4xl font-bold text-center">
            Commande #{order.shortId}
          </h1>
          <p className=" px-2 py-1 bg-yellow-500 text-white rounded text-sm font-medium">
            En attente de paiement
          </p>
        </header>
        <div className="flex flex-col gap-4 max-w-96 w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Récapitulatif</h2>
          </div>
          {order.type == "diner" && (
            <p>
              Livraison :{" "}
              <span className="font-semibold">
                Entre {order.deliveryTime} et{" "}
                {(order.deliveryTime.length > 3
                  ? dayjs(order.deliveryTime, "HH[h]mm")
                  : dayjs(order.deliveryTime, "HH[h]")
                )
                  .add(1, "hour")
                  .format("HH[h]mm")}
              </span>{" "}
              à <span className="font-semibold">{order.deliveryPlace}</span>
            </p>
          )}
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
            Tu pensais que les prix sur la page de commande c'était pour faire
            joli ? Aligne les <span className="font-bold">{order.price}€</span>{" "}
            et ensuite on te régalera.
          </p>
          <p className="text-center text-sm -mt-2">
            Si tu as déjà payé, laisse nous un instant pour qu'on vérifie le
            montant du paiement avant qu'on valide ta commande. Tu ne pourras
            plus annuler ta commande une fois le paiement effectué.
          </p>
          <Link
            href="https://lydia-app.com/pots?id=41176-stat-wars"
            target="_blank"
            className="bg-blue-700 bg-opacity-80 backdrop-blur-sm w-full py-8 rounded-xl text-lg text-white font-bold text-center"
          >
            PAYER ({order.price}€)
          </Link>
          <p className="text-center text-sm">
            On va vérifier que t'as entré le bon montant pas d'entourloupe!
          </p>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="bg-red-500 bg-opacity-80 backdrop-blur-sm text-white font-bold text-center rounded-xl py-2 w-full"
          >
            Annuler la commande
            {isPending && <Spinner className="border-white ml-2" />}
          </button>
        </main>
      </div>
    </NavWrapper>
  )
}
