import { MealData } from "@/utils/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faSave } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import updateHotlineMealStock from "@/api/admin/updateHotlineMealStock"

export default function AdminHotlineMealItem({
  meal,
  mealIndex,
  sectionName,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [stock, setStock] = useState(meal.stock ?? 0)

  useEffect(() => {
    if (!editing) return
    setStock(meal.stock ?? 0)
  }, [meal.stock])

  const save = () => {
    updateHotlineMealStock(stock, { mealIndex, sectionName })
    setEditing(false)
  }

  return (
    <div className="flex justify-between items-center gap-8">
      <p>
        {meal.name} ({meal.price}€)
      </p>
      <div className="flex items-center gap-4">
        {editing ? (
          <>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              className="border border-gray-300 rounded p-2 w-16"
            />
            <button
              onClick={save}
              className="text-white bg-gray-950 rounded h-8 w-8 flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </>
        ) : (
          <>
            <p className="font-semibold w-16">{meal.stock}</p>
            <button
              onClick={() => setEditing(true)}
              className="bg rounded h-8 w-8 flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

type Props = {
  sectionName: string
  meal: MealData & { stock: number }
  mealIndex: string
}
