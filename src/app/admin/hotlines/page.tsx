"use client"

import { firestore } from "@/config/firebase"
import { HotlineMenu, MealData, Menu } from "@/utils/types"
import { doc, onSnapshot } from "firebase/firestore"
import Link from "next/link"
import { useEffect, useState } from "react"
import AdminHotlineMealItem from "./MealItem"
import updateHotlineMealStock from "@/api/admin/updateHotlineMealStock"
import updateHotlineStatus from "@/api/admin/updateHotlineStatus"

export default function AdminHotlinesPage() {
  const [hotlineActive, setHotlineActive] = useState(false)
  const [hotline, setHotline] = useState<HotlineMenu | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "global", "hotlines"),
      (doc) => {
        setHotlineActive(!!doc.data()?.active)
      }
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "menus", "HOTLINE"),
      (doc) => {
        setHotline(doc.data() as HotlineMenu)
      }
    )
    return unsubscribe
  }, [])

  // const updateStock = async (
  //   stock: number,
  //   meal: MealData,
  //   sectionName: string
  // ) => {
  //   await updateHotlineMealStock(stock, {
  //     meal,
  //     meals: hotline?.content?.[sectionName]?.meals ?? [],
  //     sectionName,
  //   })
  // }

  if (hotline?.type !== "hotline") return null

  return (
    <div className="max-w-full flex flex-col">
      <div className="flex relative justify-between items-center p-8">
        <h1 className="text-4xl font-bold">Hotlines</h1>
        <div className="sticky top-8 right-8 flex items-center gap-8">
          <Link
            href="/admin/menus/HOTLINE"
            className="bg p-4 rounded font-semibold"
          >
            Modifier le contenu
          </Link>
          {hotlineActive ? (
            <button
              onClick={() => updateHotlineStatus(false)}
              className="bg-green-500 text-white p-4 rounded font-semibold"
            >
              Stopper la hotline
            </button>
          ) : (
            <button
              onClick={() => updateHotlineStatus(true)}
              className="bg-red-500 text-white p-4 rounded font-semibold"
            >
              Lancer la hotline
            </button>
          )}
        </div>
      </div>
      <h2 className="pl-8 text-2xl font-semibold">
        Gérer les quantités disponibles
      </h2>
      <div className="flex p-8 gap-8 overflow-x-auto">
        <div className="flex gap-8 p-8 overflow-x-auto">
          {Object.entries(hotline?.content ?? {}).map(
            ([sectionName, section]) => (
              <div key={sectionName} className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold">{sectionName}</h2>
                {Object.entries(section.meals).map(([i, meal]) => (
                  <AdminHotlineMealItem
                    key={meal.id}
                    sectionName={sectionName}
                    meal={meal}
                    mealIndex={i}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
