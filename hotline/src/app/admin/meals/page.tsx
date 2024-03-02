"use client"

import { MealData, Menu } from "@/utils/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import AdminMealItem from "./MealItem"
import getAllMeals from "@/api/admin/getAllMeals"
import { useQuery } from "@tanstack/react-query"

export default function AdminMealsPage() {
  const [meals, setMeals] = useState<MealData[]>([])

  const { data } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getAllMeals(),
  })

  useEffect(() => {
    if (!data) return
    setMeals(data)
  }, [data])

  return (
    <>
      <div className="flex justify-between items-center p-8">
        <h1 className="text-4xl font-bold">Ingrédients</h1>
        <Link
          href="/admin/meals/create"
          className="bg-gray-950 text-white p-4 rounded font-semibold"
        >
          + Ajouter un ingrédient
        </Link>
      </div>
      <div className="flex gap-4 p-8">
        <div className="flex-[1] flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Liste des ingrédients</h2>
          <div className="flex flex-wrap gap-4 items-stretch">
            {meals.map((meal) => (
              <AdminMealItem key={meal.id} {...meal} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

type MenuGroup = {
  date: number
  breakfast: Menu[]
  lunch: Menu[]
  diner: Menu[]
}
