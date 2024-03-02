"use client"

import getMenu from "@/api/client/getMenu"
import { MealData } from "@/utils/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import MealPicker from "../create/MealPicker"
import updateMenu from "@/api/admin/updateMenu"
import getAllMeals from "@/api/admin/getAllMeals"
import deleteMenu from "@/api/admin/deleteMenu"
import { entries, values } from "@/utils/functions"

export default function AdminMenuEditPage() {
  const [selected, setSelected] = useState<Record<number, string[]>>([])
  const [sections, setSections] = useState<Section[]>([])
  const [meals, setMeals] = useState<Record<string, MealData>>({})
  const [options, setOptions] = useState<string[]>([])

  const { id: menuId } = useParams()

  const { register, handleSubmit, setValue } = useForm()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: menu } = useQuery({
    queryKey: ["menu", menuId],
    queryFn: () => getMenu(menuId as string),
  })

  useEffect(() => {
    if (!menu) return
    console.log(menu)
    const { name, desc, price, day, type, content } = menu
    const _sections = entries(content).map(([name, section], i) => ({
      name,
      maxQty: section.maxQty,
      meals: values(section.meals).map((meal) => meal.id),
      index: i,
    }))
    setSections(_sections)
    setSelected(
      _sections.reduce((acc, section, i) => {
        acc[i] = section.meals
        return acc
      }, {} as Record<number, string[]>)
    )
    setValue("name", name)
    setValue("desc", desc)
    setValue("price", price)
    setValue("day", day)
    setValue("type", type)
    _sections.forEach((section, i) => {
      register(`sections.${i}.name`, { value: section.name })
      register(`sections.${i}.maxQty`, { value: section.maxQty })
    })
  }, [menu])

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

  const prevMeals: Record<string, MealData> = useMemo(() => {
    if (!menu) return {}
    return values(menu.content).reduce((acc, section) => {
      values(section.meals).forEach((meal) => {
        acc[meal.id] = { ...meal }
      })
      return acc
    }, {} as any)
  }, [menu])

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

  const removeSection = (index: number) => {
    setSections((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1).map((section) => ({
        ...section,
        index: section.index - 1,
      })),
    ])
    setSelected((prev) => {
      const _prev = { ...prev }
      delete _prev[index]
      return _prev
    })
  }

  const update = async (data: any) => {
    const { name, desc, price, day, type, sections } = data
    const _sections: Section[] = sections
    const content = _sections.reduce((acc, section, i) => {
      if (!selected[i]) return acc
      acc[section.name] = menuId.includes("HOTLINE")
        ? {
            meals: selected[i].reduce((acc, id, _i) => {
              acc[_i] = prevMeals[id]
                ? {
                    ...prevMeals[id],
                    ...meals[id],
                  }
                : { ...meals[id], stock: 0 }
              return acc
            }, {} as any),
          }
        : {
            maxQty: section.maxQty,
            meals: selected[i].map((id) => ({ id, name: meals[id].name })),
          }
      return acc
    }, {} as any)

    await updateMenu(
      menuId.includes("HOTLINE")
        ? { ...menu, content }
        : ({
            id: menuId,
            name,
            desc,
            price,
            day,
            type,
            content,
          } as any)
    )

    await queryClient.invalidateQueries({
      queryKey: ["menu"],
    })

    if (menuId.includes("HOTLINE")) router.push("/admin/hotlines")
    else router.push("/admin/menus")
  }

  const _delete = async () => {
    await deleteMenu(menuId as string)
    queryClient.invalidateQueries({
      queryKey: ["menu"],
    })
    router.push("/admin/menus")
  }

  return (
    <>
      <div className="flex justify-between items-center p-8">
        <h1 className="text-4xl font-bold">
          Modifier {menu?.id.includes("HOTLINE") ? "la hotline" : "un menu"}
        </h1>
        <div className="flex items-center gap-4">
          {!menuId.includes("HOTLINE") && (
            <button
              type="button"
              onClick={_delete}
              className="bg-red-50 text-red-500 border border-red-500 p-4 font-semibold rounded"
            >
              Supprimer
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit(update)}
            className="bg-black text-white p-4 rounded font-semibold"
          >
            Enregistrer
          </button>
        </div>
      </div>
      <form className="flex gap-8 p-8">
        {!menuId.includes("HOTLINE") && (
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
        )}
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
              {!menuId.includes("HOTLINE") && (
                <>
                  <label className="-mb-2" htmlFor={`sections.${i}.maxQty`}>
                    Nombre maximum d'éléments
                  </label>
                  <input
                    type="number"
                    min={1}
                    id={`sections.${i}.maxQty`}
                    className="border border-gray-200 p-2 rounded"
                    {...register(`sections.${i}.maxQty`, {
                      valueAsNumber: true,
                    })}
                  />
                </>
              )}
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
              <button
                onClick={() => removeSection(i)}
                type="button"
                className="border rounded border-red-500 text-red-500 font-semibold text-center bg-red-50 py-2"
              >
                Supprimer la section
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="w-full p-4 flex items-center justify-center rounded-lg bg hover:bg-opacity-95"
          >
            + Ajouter une section
          </button>
        </div>
      </form>
    </>
  )
}

type Section = {
  index: number
  name: string
  maxQty: number
  meals: string[]
}
