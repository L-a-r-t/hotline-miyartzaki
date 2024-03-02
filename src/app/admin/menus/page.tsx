"use client"

import getAllMenus from "@/api/admin/getAllMenus"
import { Menu } from "@/utils/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import AdminMenuItem from "./MenuItem"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { useQuery } from "@tanstack/react-query"
import AdminDayDeliverySettings from "./DayDeliverySettings"
import { doc, onSnapshot } from "firebase/firestore"
import { firestore } from "@/config/firebase"
import { values } from "@/utils/functions"

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([])
  const [deliverySettings, setDeliverySettings] = useState<Record<string, any>>(
    {}
  )

  const { data } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getAllMenus(),
  })

  useEffect(() => {
    if (!data) return
    const unsubscribe = onSnapshot(
      doc(firestore, "global", "delivery"),
      (doc) => {
        setDeliverySettings(doc.data() ?? ({} as any))
      }
    )
    return unsubscribe
  }, [data])

  useEffect(() => {
    if (!data) return
    const menus = data
    setMenus(menus)
    const _menuGroups = menus.reduce((acc, menu) => {
      if (menu.id.includes("HOTLINE")) return acc
      const day = menu.day
      if (!acc[day])
        acc[day] = {
          date: dayjs(menu.day).valueOf(),
          breakfast: [],
          lunch: [],
          diner: [],
        }
      switch (menu.type) {
        case "breakfast":
          acc[day].breakfast.push(menu)
          break
        case "lunch":
          acc[day].lunch.push(menu)
          break
        case "diner":
          acc[day].diner.push(menu)
          break
      }
      return acc
    }, {} as Record<string, MenuGroup>)
    setMenuGroups(
      Object.values(_menuGroups).sort(
        (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
      )
    )
  }, [data])

  return (
    <div className="max-w-full flex flex-col">
      <div className="flex relative justify-between items-center p-8">
        <h1 className="text-4xl font-bold">Menus</h1>
        <Link
          href="/admin/menus/create"
          className="sticky top-8 right-8 bg-gray-950 text-white p-4 rounded font-semibold"
        >
          + Ajouter un menu
        </Link>
      </div>
      <div className="flex gap-8 p-8 overflow-x-auto">
        {menuGroups.map((menuGroup, i) => (
          <>
            <div key={`menuGroup${i}`} className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold">
                {dayjs(menuGroup.date).locale("fr").format("DD MMMM")}
              </h2>
              <AdminDayDeliverySettings
                day={menuGroup.date}
                data={
                  deliverySettings[dayjs(menuGroup.date).format("YYYY-MM-DD")]
                }
               />
              <div className="flex flex-col gap-4 min-w-64">
                <h3 className="text-xl font-bold">Petit déjeuner</h3>
                <div className="flex flex-wrap gap-4 items-stretch">
                  {menuGroup.breakfast.length == 0 && (
                    <p className="italic text-gray-500 -mt-4">Nada</p>
                  )}
                  {menuGroup.breakfast.map((menu, i) => (
                    <AdminMenuItem key={menu.id} {...menu} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4 min-w-64">
                <h3 className="text-xl font-bold">Déjeuner</h3>
                <div className="flex flex-wrap gap-4 items-stretch">
                  {menuGroup.lunch.length == 0 && (
                    <p className="italic text-gray-500 -mt-4">Nada</p>
                  )}
                  {menuGroup.lunch.map((menu, i) => (
                    <AdminMenuItem key={menu.id} {...menu} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4 min-w-64">
                <h3 className="text-xl font-bold">Diner</h3>
                <div className="flex flex-wrap gap-4 items-stretch">
                  {menuGroup.diner.length == 0 && (
                    <p className="italic text-gray-500 -mt-4">Nada</p>
                  )}
                  {menuGroup.diner.map((menu, i) => (
                    <AdminMenuItem key={menu.id} {...menu} />
                  ))}
                </div>
              </div>
            </div>
            {i !== menuGroups.length - 1 && (
              <div className="w-[1px] h-full bg-gray-300" />
            )}
          </>
        ))}
      </div>
    </div>
  )
}

type MenuGroup = {
  date: number
  breakfast: Menu[]
  lunch: Menu[]
  diner: Menu[]
}
