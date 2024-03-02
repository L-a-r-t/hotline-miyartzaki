"use client"

import Image from "next/image"
import { redirect, useRouter } from "next/navigation"
import { useContext, useEffect, useMemo, useState } from "react"
import {
  DaySettings,
  Delivery,
  FullMenu,
  HotlineDevlieryOption,
  HotlineMenu,
  OrderRecap,
} from "@/utils/types"
import dayjs from "dayjs"
import Link from "next/link"
import { Disclosure, Transition } from "@headlessui/react"
import createReservation from "@/api/client/createReservation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAuth from "@/hooks/auth"
import { ModalContext } from "@/context/modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faLeaf } from "@fortawesome/free-solid-svg-icons"
import { doc, onSnapshot } from "firebase/firestore"
import { firestore } from "@/config/firebase"
import NavWrapper from "@/components/nav"
import Spinner from "@/components/spinner"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { dayjsWithDelta, entries, values } from "@/utils/functions"
import { useForm } from "react-hook-form"
import Background from "@/components/background"

dayjs.extend(customParseFormat)

export default function HotlinePage() {
  const user = useAuth()
  const { openModalWithMeal } = useContext(ModalContext)

  const [menu, setMenu] = useState<HotlineMenu | null>(null)
  const [isHotlineOpen, setHotlineStatus] = useState(false)
  const [askedDeliveryTime, setAskedDeliveryTime] = useState("12h00")
  const [livesOutsideResidence, setlivesOutsideResidence] = useState(false)
  const [deliveryTimes, setDeliveryTimes] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
        doc(firestore, "menus", "HOTLINE"),
        (snapshot) => {
          const _menu = snapshot.data() as HotlineMenu
          setMenu(_menu)
        }
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
        doc(firestore, "global", "hotlines"),
        (snapshot) => {
          setHotlineStatus(snapshot.data()?.active)
        }
    )
    return unsubscribe
  }, [])

  const {
    register,
    getValues,
    formState: { isValid, errors },
    watch,
    reset,
  } = useForm()

  const queryClient = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: () => {
      let {
        tetine,
        delivery: {
          address,
          address2,
          city,
          residence,
          chamber,
          additionalInfo,
          deliveryTime,
        },
      } = getValues()
      if (tetine) additionalInfo = "[BON POUR TÉTINE] " + additionalInfo
      const delivery: Delivery = residence
          ? {
            type: "residence",
            residence: JSON.parse(residence).place as string,
            chamber,
            deliveryTime,
            additionalInfo: additionalInfo ?? null,
          }
          : {
            type: "city",
            address,
            address2: address2 ?? null,
            city: JSON.parse(city).place as string,
            deliveryTime,
            additionalInfo: additionalInfo ?? null,
          }
      return createReservation({
        orderRecap,
        userId: user !== "loading" ? user!.uid : "", // faut faire plaisir à typescript
        date: dayjs().valueOf(),
        targetDay: dayjsWithDelta(1).format("YYYY-MM-DD"),
        delivery,
        type: "hotline",
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["order"],
      })
      router.replace("/order/" + data.id)
    },
  })

  const router = useRouter()

  const orderRecap = useMemo(() => {
    let acc = {} as OrderRecap
    if (!menu) return { HOTLINE: { price: 0, items: [] } }
    entries(menu.content).forEach(([sectionName, section]) => {
      values(section.meals).forEach((meal) => {
        if (meal.qty !== undefined && meal.qty > 0) {
          if (!acc[sectionName])
            acc[sectionName] = {
              price: sectionName.includes("salée") ? 1.5 : 0,
              items: [],
            }
          acc[sectionName].price += meal.price * meal.qty
          acc[sectionName].items.push({
            time: "hotline",
            menu: menu.name,
            menuId: menu.id,
            section: sectionName,
            meal: meal.name,
            mealId: meal.id,
            isVegetarian: meal.isVegetarian,
            qty: meal.qty,
            price: meal.price,
          })
        }
      })
    })
    return acc
  }, [menu])

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
      place: "Twenty Palaiseau",
    },
    {
      type: "residence",
      place: "Kley",
    },
    {
      type: "residence",
      place: "Georges Sand",
      deliveryTime: "20h30",
    },
    {
      type: "residence",
      place: "Eileen Gray",
      deliveryTime: "20h30",
    },
    {
      type: "residence",
      place: "Twenty Gif",
      deliveryTime: "20h30",
    },
    {
      type: "city",
      place: "Palaiseau",
      deliveryTime: "22h",
    },
    {
      type: "city",
      place: "Massy",
      deliveryTime: "22h",
    },
  ]

  useEffect(() => {
    const _ = watch((data, { name }) => {
      if (name != "delivery.city" && name != "delivery.residence") return
      const place =
          name == "delivery.city" ? data.delivery.city : data.delivery.residence
      const deliveryTime = JSON.parse(place).deliveryTime
      if (deliveryTime) {
        setDeliveryTimes([deliveryTime])
      } else {
        setDeliveryTimes(
            new Array(8).fill(0).map((_, i) =>
                dayjs(dayjs().format("YYYY-MM-DDTHH:00:00"))
                    .add(i + 1, "h")
                    .format("HH[h]mm")
            )
        )
      }
    })
    return _.unsubscribe
  }, [watch])

  const incrementMeal = (
      increment: number,
      {
        sectionName,
        mealIndex,
      }: {
        sectionName: string
        mealIndex: number
      }
  ) => {
    if (!menu) return
    const content = Object.entries(menu.content).reduce(
        (acc, [name, section]) => {
          const sameSection = name === sectionName
          section.meals = Object.values(section.meals).map((meal, index) => {
            const sameMeal = sameSection && index === mealIndex
            if (meal.qty === undefined) meal.qty = 0
            meal.qty += sameMeal ? increment : 0
            return meal
          })
          return acc
        },
        { ...menu.content }
    )
    setMenu((prev) => (prev == null ? prev : { ...prev, content }))
  }

  const needsDeliveryInfo = useMemo(
      () =>
          values(orderRecap).some((order) =>
              order.items.some((item) => item.time === "hotline")
          ),
      [orderRecap]
  )

  const missingDeliveryInfo = useMemo(
      () => needsDeliveryInfo && !isValid,
      [needsDeliveryInfo, isValid]
  )

  if (user === "loading" || user === null) return <div />

  return (
      <NavWrapper>
        <div className="relative min-h-screen flex flex-col">
          {/* <header className="sticky top-0 flex justify-between items-center p-4 px-8 bg-purple-950 bg-opacity-20 backdrop-blur-sm shadow-xl shadow-purple-950/10"> */}
          <header className="top-0 flex flex-col sm:flex-row justify-between items-center p-8 pb-4">
            <Image src={"/logo.svg"} alt="Logo" width={100} height={100} />
            <p className="text-2xl md:text-4xl text-center font-bold mt-4">
              La hotline est {isHotlineOpen ? "OUVERTE" : "FERMÉE"}
            </p>
            {!isHotlineOpen && (
                <p className="text-sm text-center">Repasse plus tard</p>
            )}
          </header>
          {isHotlineOpen ? (
              <main className="md:flex flex-grow flex flex-col items-center justify-between gap-4">
                {menu ? (
                    <div className="flex flex-col gap-4 p-4 w-full max-w-96">
                      {Object.entries(menu.content)
                          .sort((a, b) => (a[0] < b[0] ? -1 : 1))
                          .map(([sectionName, section]) => (
                              <Disclosure
                                  as={"div"}
                                  key={sectionName}
                                  className="rounded-xl bg shadow-2xl shadow-blue-950/15 flex flex-col"
                              >
                                <Disclosure.Button className="flex p-2 px-4 justify-between items-center font-semibold">
                                  <h2 className="text-lg">{sectionName}</h2>
                                </Disclosure.Button>
                                <Transition
                                    enter="transition duration-100 ease-in-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-100 ease-in-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                  <Disclosure.Panel static>
                                    <div className="flex flex-col gap-2 px-4 pb-4">
                                      <div className="flex flex-col gap-4">
                                        {Object.values(section.meals).map(
                                            (meal, mealIndex) => {
                                              const totalQty = values(orderRecap).reduce(
                                                  (acc, order) => {
                                                    return (
                                                        acc +
                                                        order.items.reduce((acc, item) => {
                                                          return (
                                                              acc +
                                                              (item.section == sectionName
                                                                  ? item.qty
                                                                  : 0)
                                                          )
                                                        }, 0)
                                                    )
                                                  },
                                                  0
                                              )
                                              const stock =
                                                  meal.stock < 0
                                                      ? sectionName.includes("salée")
                                                          ? 1
                                                          : 2
                                                      : 0
                                              const totalStock = sectionName.includes("salée")
                                                  ? 99
                                                  : 2
                                              return (
                                                  <div
                                                      key={menu.id + sectionName + meal.id}
                                                      className="flex justify-between items-center gap-2"
                                                  >
                                                    <div>
                                                      <h4
                                                          className={`cursor-pointer ${
                                                              stock == undefined ||
                                                              (stock <= 0 && "text-gray-400")
                                                          }`}
                                                          onClick={() => openModalWithMeal(meal)}
                                                      >
                                                        {meal.name}{" "}
                                                        {meal.price > 0 && `(${meal.price}€)`}
                                                        {meal.isVegetarian && (
                                                            <FontAwesomeIcon
                                                                icon={faLeaf}
                                                                className={`${
                                                                    stock == undefined || stock <= 0
                                                                        ? "text-gray-'00"
                                                                        : "text-green-700"
                                                                } ml-2`}
                                                            />
                                                        )}
                                                      </h4>
                                                    </div>
                                                    {stock > 0 && (
                                                        <div className="flex items-center gap-2">
                                                          {meal.qty !== undefined &&
                                                              meal.qty > 0 && (
                                                                  <>
                                                                    <button
                                                                        onClick={() =>
                                                                            incrementMeal(-1, {
                                                                              sectionName,
                                                                              mealIndex,
                                                                            })
                                                                        }
                                                                        className="bg-white border rounded-full w-6 h-6 flex items-center justify-center"
                                                                    >
                                                                      -
                                                                    </button>
                                                                    <p className="w-4 text-center">
                                                                      {meal.qty ?? 0}
                                                                    </p>
                                                                  </>
                                                              )}
                                                          {(meal.qty === undefined ||
                                                                  meal.qty < stock) &&
                                                              totalQty < totalStock && (
                                                                  <button
                                                                      onClick={() =>
                                                                          incrementMeal(1, {
                                                                            sectionName,
                                                                            mealIndex,
                                                                          })
                                                                      }
                                                                      className="bg-white border rounded-full w-6 h-6 flex items-center justify-center"
                                                                  >
                                                                    +
                                                                  </button>
                                                              )}
                                                        </div>
                                                    )}
                                                  </div>
                                              )
                                            }
                                        )}
                                      </div>
                                    </div>
                                  </Disclosure.Panel>
                                </Transition>
                              </Disclosure>
                          ))}
                    </div>
                ) : null}
                <div className="flex flex-col w-full max-w-96">
                  <div className="p-4">
                    <p className="p-2 rounded bg text-justify">
                      NB: Tu peux prendre jusqu'à 2 crêpes salées et 2 crêpes
                      sucrées !
                    </p>
                  </div>
                </div>
                <Transition
                    as="div"
                    className="inset-x-0 bottom-0 w-full max-w-96 rounded-t-2xl p-4 bg-md"
                    show={values(orderRecap).some((order) => order.items.length > 0)}
                    enter="transition-all duration-[400ms] ease-in-out"
                    enterFrom="transform translate-y-full"
                    enterTo="transform translate-y-0"
                    leave="transition-all duration-[400ms] ease-in-out"
                    leaveFrom="transform translate-y-0"
                    leaveTo="transform translate-y-full"
                >
                  <div key={menu + "recap"} className="flex flex-col">
                    {entries(orderRecap)
                        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
                        .map(([section, order]) => (
                            <div key={section + "recap"} className="flex flex-col">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold">{section}</h4>
                                <p>{order.price}€</p>
                              </div>
                              {order.items.map((item) => (
                                  <div
                                      key={item.section + item.section + item.meal}
                                      className="flex items-center gap-2"
                                  >
                                    <p className="font-semibold">{item.qty}</p>
                                    <p>{item.meal}</p>
                                  </div>
                              ))}
                            </div>
                        ))}
                    {needsDeliveryInfo && (
                        <>
                          <Disclosure>
                            {({ open }) => (
                                <>
                                  <Disclosure.Button className="flex items-center justify-center w-full gap-2 font-semibold px-2 py-1">
                                    Infos de livraison
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`${
                                            open && "transform -rotate-180"
                                        } transition duration-200`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="flex flex-col gap-2">
                                    <p className="text-sm text-gray-500">
                                      Les champs avec * sont obligatoires. Livraison
                                      côté Centrale à 20h30, hors plateau à 22h
                                      {values(deliveryOptions).every(
                                          (o) => o.type == "residence"
                                      )
                                          ? ", livraisons en résidence uniquement"
                                          : ""}
                                    </p>
                                    {values(deliveryOptions).some(
                                        (o) => o.type == "city"
                                    ) && (
                                        <div className="flex gap-2 items-center">
                                          <input
                                              type="checkbox"
                                              onChange={(e) =>
                                                  setlivesOutsideResidence(e.target.checked)
                                              }
                                              checked={livesOutsideResidence}
                                              className="border rounded w-6 h-6 accent-black"
                                          />
                                          <label htmlFor="livesOutsideResidence">
                                            Je n'habite pas en résidence
                                          </label>
                                        </div>
                                    )}
                                    {livesOutsideResidence ? (
                                        <>
                                          <div className="flex flex-col w-full">
                                            <label htmlFor="delivery.city">Ville*</label>
                                            <select
                                                className="border rounded px-2 py-1"
                                                {...register("delivery.city", {
                                                  required: true,
                                                  shouldUnregister: true,
                                                })}
                                            >
                                              <option value="">Choisir</option>
                                              {values(deliveryOptions)
                                                  .filter((option) => option.type == "city")
                                                  .map((option) => (
                                                      <option
                                                          key={option.place}
                                                          value={JSON.stringify(option)}
                                                      >
                                                        {option.place}
                                                      </option>
                                                  ))}
                                            </select>
                                          </div>
                                          <div className="flex flex-col w-full">
                                            <label htmlFor="delivery.address">
                                              Addresse*
                                            </label>
                                            <input
                                                className="border rounded px-2 py-1"
                                                {...register("delivery.address", {
                                                  required: true,
                                                  shouldUnregister: true,
                                                })}
                                            />
                                          </div>
                                          <div className="flex flex-col w-full">
                                            <label htmlFor="delivery.address2">
                                              Complément d'addresse
                                            </label>
                                            <input
                                                className="border rounded px-2 py-1"
                                                {...register("delivery.address2", {
                                                  shouldUnregister: true,
                                                })}
                                            />
                                          </div>
                                        </>
                                    ) : (
                                        <>
                                          <div className="flex flex-col w-full">
                                            <label>Résidence*</label>
                                            <select
                                                className="border rounded px-2 py-1"
                                                {...register("delivery.residence", {
                                                  required: true,
                                                  shouldUnregister: true,
                                                })}
                                            >
                                              <option value="">Choisir</option>
                                              {values(deliveryOptions)
                                                  .filter(
                                                      (option) => option.type == "residence"
                                                  )
                                                  .map((option) => (
                                                      <option
                                                          key={option.place}
                                                          value={JSON.stringify(option)}
                                                      >
                                                        {option.place}
                                                      </option>
                                                  ))}
                                            </select>
                                          </div>
                                          <div className="flex flex-col w-full">
                                            <label htmlFor="delivery.address2">
                                              Chambre/Appartement*
                                            </label>
                                            <input
                                                className="border rounded px-2 py-1"
                                                {...register("delivery.chamber", {
                                                  required: true,
                                                  shouldUnregister: true,
                                                })}
                                            />
                                          </div>
                                        </>
                                    )}
                                    <div className="flex flex-col gap-2 w-full">
                                      <label htmlFor="delivery.deliveryTime">
                                        Heure de livraison*
                                      </label>
                                      <select
                                          className="border rounded px-2 py-1"
                                          {...register("delivery.deliveryTime", {
                                            required: true,
                                          })}
                                      >
                                        <option value="">Choisir</option>
                                        {deliveryTimes.map((time) => (
                                            <option key={time} value={time}>
                                              {time}
                                            </option>
                                        ))}
                                      </select>
                                      <label htmlFor="delivery.additionalInfo">
                                        Instructions de livraison
                                      </label>
                                      <input
                                          className="border rounded px-2 py-1"
                                          {...register("delivery.additionalInfo")}
                                          placeholder="Code d'entrée, étage, etc."
                                      />
                                      <label className="text-sm flex items-center">
                                        <input
                                            className="border mr-2 rounded px-2 py-1 h-4 w-4 accent-black"
                                            type="checkbox"
                                            {...register("tetine")}
                                        />
                                        J'ai un bon pour tétine
                                      </label>
                                    </div>
                                  </Disclosure.Panel>
                                </>
                            )}
                          </Disclosure>
                        </>
                    )}
                  </div>
                  <button
                      disabled={isPending || missingDeliveryInfo}
                      onClick={() => mutate()}
                      className="w-full bg-gray-950 text-white font-semibold p-4 mt-4 rounded flex justify-center items-center gap-2"
                  >
                    {missingDeliveryInfo && "Il manque des infos Morray"}
                    {!missingDeliveryInfo &&
                        (isPending
                            ? "Ça arrive"
                            : "Commander (" +
                            String(
                                Math.round(
                                    Object.values(orderRecap).reduce(
                                        (acc, order) => (acc += order.price),
                                        0
                                    ) * 100
                                ) / 100
                            ) +
                            "€)")}
                    {isPending && <Spinner className="border-white" />}
                  </button>
                </Transition>
              </main>
          ) : (
              <main className="flex-grow flex justify-center items-center">
                <Image
                    src={"/sad.jpg"}
                    alt="C'est trop triste :("
                    width={250}
                    height={250}
                />
              </main>
          )}
        </div>
      </NavWrapper>
  )
}

const DeliveryTimes = () => {
  const [djs] = useState(
      dayjs()
          .subtract(dayjs().minute() % 15, "m")
          .add(30, "m")
  )

  return (
      <>
        {new Array(16).fill(0).map((_, i) => (
            <option
                key={`deliveryTime${i}`}
                value={djs.add(i * 15, "m").format("HH[h]mm")}
            >
              {djs.add(i * 15, "m").format("HH[h]mm")}
            </option>
        ))}
      </>
  )
}
