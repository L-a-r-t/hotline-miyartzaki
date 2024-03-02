"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import getMeal from "@/api/client/getMeal"
import updateMeal from "@/api/admin/updateMeal"
// import { MealData } from "@/utils/types"

export default function AdminMealEditPage() {
  const [ingredients, setIngredients] = useState<string[]>([])

  const { register, handleSubmit, setValue } = useForm()

  const router = useRouter()
  const queryClient = useQueryClient()

  const { id: mealId } = useParams()

  const { data: meal } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => getMeal(mealId as string),
  })

  useEffect(() => {
    if (!meal) return
    console.log(meal)
    const { name, desc, price, ingredients, isVegetarian } = meal
    setIngredients(ingredients)
    setValue("name", name)
    setValue("desc", desc)
    setValue("price", price)
    setValue("isVegetarian", isVegetarian)
  }, [meal])

  const addIngredient = () => {
    setIngredients((prev) => [...prev, ""])
  }

  const removeIngredient = (index: number) => {
    setIngredients((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ])
  }

  const update = async (data: any) => {
    const { name, desc, isVegetarian } = data
    await updateMeal({
      ...meal,
      name,
      desc,
      price: 0,
      isVegetarian,
      ingredients,
    } as any)
    await queryClient.invalidateQueries({
      queryKey: ["meals"],
    })
    router.push("/admin/meals")
  }

  return (
    <>
      <div className="flex justify-between items-center p-8">
        <h1 className="text-4xl font-bold">Ajouter un plat</h1>
        <button
          type="button"
          onClick={handleSubmit(update)}
          className="bg-black text-white p-4 rounded font-semibold"
        >
          Enregistrer
        </button>
      </div>
      <form className="flex gap-4 p-8">
        <div className="flex-[1] flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Informations de base</h2>
          <label className="-mb-2" htmlFor="name">
            Nom
          </label>
          <input
            type="text"
            id="name"
            className="border border-gray-200 p-2 rounded"
            {...register("name", { required: true })}
          />
          <label className="-mb-2" htmlFor="desc">
            Description
          </label>
          <textarea
            id="desc"
            className="border border-gray-200 p-2 rounded"
            rows={4}
            {...register("desc")}
          />
          <label className="-mb-2" htmlFor="price">
            Prix (si commandé en extra)
          </label>
          {/* <input
            type="number"
            id="price"
            className="border border-gray-200 p-2 rounded"
            {...register("price", { required: true, valueAsNumber: true })}
          /> */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVegetarian"
              className="border border-gray-200 p-2 rounded w-6 h-6"
              {...register("isVegetarian")}
            />
            <label htmlFor="isVegetarian">Végétarien</label>
          </div>
        </div>
      </form>
    </>
  )
}
