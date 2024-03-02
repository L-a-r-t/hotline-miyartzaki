"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import MealPicker from "./MealPicker"
import { MealData } from "@/utils/types"
import getAllMeals from "@/api/admin/getAllMeals"
import { useForm } from "react-hook-form"
import createMenu from "@/api/admin/createMenu"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export default function AdminCreateMenuPage() {
  const [selected, setSelected] = useState<Record<number, string[]>>([])
  const [sections, setSections] = useState<Section[]>([])
  const [meals, setMeals] = useState<Record<string, MealData>>({})
  const [options, setOptions] = useState<string[]>([])

  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getAllMeals(),
  })

  useEffect(() => {
    if (!data) return
    const meals = data
    setMeals(
      meals.reduce((acc, meal) => ({ ...acc, [meal.id]: meal }), {}) as Record<
        string,
        MealData
      >
    )
    const options = meals.map((meal) => meal.id)
    setOptions(options)
  }, [data])

  const select = (option: string, sectionIndex: number) => {
    setSelected((prev) => ({
      ...prev,
      [sectionIndex]: [...prev[sectionIndex], option],
    }))
  }

  const unselect = (option: string, sectionIndex: number) => {
    const index = selected[sectionIndex].indexOf(option)
    setSelected((prev) => ({
      ...prev,
      [sectionIndex]: [
        ...prev[sectionIndex].slice(0, index),
        ...prev[sectionIndex].slice(index + 1),
      ],
    }))
  }

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { index: prev.length, name: "", maxQty: 0, meals: [] },
    ])
    setSelected((prev) => ({ ...prev, [Object.keys(prev).length]: [] }))
  }

  const addMenu = async (data: any) => {
    const { name, desc, price, day, type, sections } = data
    const _sections: Section[] = sections
    const content = _sections.reduce((acc, section, i) => {
      acc[section.name] = {
        maxQty: section.maxQty,
        meals: selected[i].map((id) => ({ id, name: meals[id].name })),
      }
      return acc
    }, {} as any)

    await createMenu({
      name,
      desc,
      price,
      day,
      type,
      content,
    } as any)

    await queryClient.invalidateQueries({
      queryKey: ["menus"],
    })
    router.push("/admin/menus")
  }

  return (
    <>
      <div className="flex justify-between items-center p-8">
        <h1 className="text-4xl font-bold">Ajouter un menu</h1>
        <button
          type="button"
          onClick={handleSubmit(addMenu)}
          className="bg-black text-white p-4 rounded font-semibold"
        >
          Enregistrer
        </button>
      </div>
      <form className="flex gap-8 p-8">
        <div className="flex-[1] flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Informations de base</h2>
          <label className="-mb-2" htmlFor="name">
            Nom
          </label>
          <input
            type="text"
            id="name"
            className="border border-gray-200 p-2 rounded"
            {...register("name")}
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
            Prix
          </label>
          <input
            type="number"
            id="price"
            className="border border-gray-200 p-2 rounded"
            {...register("price", { valueAsNumber: true })}
          />
          <label className="-mb-2" htmlFor="day">
            Jour
          </label>
          <input
            type="date"
            id="day"
            className="border border-gray-200 p-2 rounded"
            {...register("day", { valueAsDate: true })}
          />
          <label className="-mb-2" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            className="border border-gray-200 p-2 rounded"
            {...register("type")}
          >
            <option value="breakfast">Petit-déjeuner</option>
            <option value="lunch">Déjeuner</option>
            <option value="diner">Dîner</option>
          </select>
        </div>
        <div className="flex-[2] flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Contenu</h2>
          {sections.map((section, i) => (
            <div
              key={section.name + i.toString()}
              className="flex flex-col gap-4 p-2 rounded-lg shadow-xl shadow-blue-950/5 bg"
            >
              <label className="-mb-2" htmlFor={`sections.${i}.name`}>
                Nom de la section
              </label>
              <input
                type="text"
                id={`sections.${i}.name`}
                className="border border-gray-200 p-2 rounded"
                {...register(`sections.${i}.name`)}
              />
              <label className="-mb-2" htmlFor={`sections.${i}.maxQty`}>
                Nombre maximum d'éléments
              </label>
              <input
                type="number"
                min={1}
                id={`sections.${i}.maxQty`}
                className="border border-gray-200 p-2 rounded"
                {...register(`sections.${i}.maxQty`, { valueAsNumber: true })}
              />
              <label className="-mb-2" htmlFor="meals">
                Éléments
              </label>
              <MealPicker
                index={i}
                selected={selected[i]}
                select={select}
                unselect={unselect}
                max={99}
                options={options}
                lookup={meals}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="w-full p-4 flex items-center justify-center rounded-lg bg"
          >
            + Ajouter une section
          </button>
          {/* TODO: Pouvoir ajouter des sections nommées où on peut spécifier 
          un choix d'éléments et le nombre de max d'éléments qu'on peut prendre. */}
        </div>
      </form>
    </>
  )
}

type Menu = {
  id: string
  name: string
  desc: string
  content: {
    [key: string]: {
      maxQty: number
      meals: string[]
    }
  }
  extras: string[]
  day: string
  type: "breakfast" | "lunch" | "diner"
}

type Section = {
  index: number
  name: string
  maxQty: number
  meals: string[]
}
