"use client"

import { firestore } from "@/config/firebase"
import { toRecord, values } from "@/utils/functions"
import { DaySettings, DeliveryOption } from "@/utils/types"
import { faChevronDown, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Disclosure } from "@headlessui/react"
import dayjs from "dayjs"
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"

export default function AdminDayDeliverySettings({
  day,
  data,
}: {
  day: number
  data: DaySettings | undefined
}) {
  const [deliveries, setDeliveries] = useState<DeliveryOption[]>(
    values(data?.options)
  )
  const [max, setMax] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setDeliveries(values(data?.options))
  }, [data])

  useEffect(() => {
    if (
      JSON.stringify(deliveries) == JSON.stringify(data?.options) &&
      max == data?.maxDeliveries
    ) {
      return
    }
    setSaving(true)
    const timeout = setTimeout(() => {
      updateDeliveryData(deliveries)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [deliveries])

  const updateDeliveryData = async (deliveries: DeliveryOption[]) => {
    try {
      await updateDoc(doc(firestore, "global", "delivery"), {
        [dayjs(day).format("YYYY-MM-DD")]: {
          day: dayjs(day).format("YYYY-MM-DD"),
          maxDeliveries: max,
          options: toRecord(deliveries),
        } as DaySettings,
      })
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        setError(err.message as string)
      }
    } finally {
      setSaving(false)
    }
  }

  const addDelivery = () => {
    setDeliveries((prev) => [
      ...prev,
      { type: "residence", place: "", hour: "", stock: 0 },
    ])
  }

  const removeDelivery = (index: number) => {
    setDeliveries((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }

  return (
    <Disclosure
      as={"div"}
      className="rounded-xl border border-gray-300 flex flex-col"
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="p-2 px-4 flex justify-center items-center font-semibold">
            <p>Réglages livraison</p>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`ml-2 transition-transform duration-200 ${
                open ? "-rotate-180 transform" : ""
              }`}
            />
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="flex flex-col px-4 pb-4 gap-4">
              <input
                value={max == 0 ? undefined : max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="border border-gray-300 p-1 rounded flex-grow text-sm w-full"
                type="text"
                placeholder="Total disponible"
              />
              {deliveries.map((delivery, i) => (
                <div
                  key={"day" + String(day) + String(i)}
                  className="flex gap-2 items-stretch"
                >
                  <div className="flex flex-col items-center flex-grow">
                    <input
                      value={delivery.place}
                      onChange={(e) =>
                        setDeliveries((prev) => [
                          ...prev.slice(0, i),
                          { ...prev[i], place: e.target.value },
                          ...prev.slice(i + 1),
                        ])
                      }
                      className="border border-gray-300 p-1 rounded-t flex-grow text-sm w-full"
                      type="text"
                      placeholder="Lieu"
                    />
                    <input
                      value={delivery.hour}
                      onChange={(e) =>
                        setDeliveries((prev) => [
                          ...prev.slice(0, i),
                          { ...prev[i], hour: e.target.value },
                          ...prev.slice(i + 1),
                        ])
                      }
                      className="border-x border-gray-300 p-1 flex-grow text-sm w-full"
                      type="text"
                      placeholder="Horaire (ex: 19h30)"
                    />
                    <input
                      value={delivery.stock == 0 ? undefined : delivery.stock}
                      onChange={(e) =>
                        setDeliveries((prev) => [
                          ...prev.slice(0, i),
                          {
                            ...prev[i],
                            stock: Number(e.target.value),
                          },
                          ...prev.slice(i + 1),
                        ])
                      }
                      className="border border-gray-300 p-1 rounded-b flex-grow text-sm w-full"
                      type="number"
                      placeholder="Stock"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div>
                      <input
                        type="checkbox"
                        className="w-full aspect-square"
                        id={"residence" + i}
                        name={"type" + i}
                        value="residence"
                        checked={delivery.type == "residence"}
                        onChange={() =>
                          setDeliveries((prev) => [
                            ...prev.slice(0, i),
                            {
                              ...prev[i],
                              type:
                                prev[i].type == "residence"
                                  ? "city"
                                  : "residence",
                            },
                            ...prev.slice(i + 1),
                          ])
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDelivery(i)}
                      className="px-2 flex-grow flex items-center justify-center rounded border border-red-500 bg-red-50 text-red-500"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addDelivery}
                className="w-full p-2 text-sm flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100"
              >
                + Ajouter lieu/horaire
              </button>
              {saving && (
                <p className="text-sm text-center text-gray-500 -my-2">
                  Enregistrement...
                </p>
              )}
              {error && (
                <p className="text-sm text-center text-red-500 -my-2">
                  {error}
                </p>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
