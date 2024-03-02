import { MealData } from "@/utils/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLeaf } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

export default function AdminMealItem(meal: MealData) {
  return (
    <Link href={"/admin/meals/" + meal.id}>
      <div
        className={`h-full flex flex-col gap-1 p-4 shadow-xl shadow-blue-950/5 rounded bg-white bg-opacity-80 backdrop-blur-sm hover:bg-opacity-100 cursor-pointer max-w-64`}
      >
        <p className={`font-semibold`}>
          {meal.name}
          {meal.isVegetarian && (
            <FontAwesomeIcon icon={faLeaf} className="text-green-700 ml-2" />
          )}
        </p>
        <p>
          {meal.ingredients.map((ingredient, i) => (
            <span className="text-sm" key={ingredient + String(i)}>
              {(i == 0 ? ingredient : ingredient.toLowerCase()) +
                (i < meal.ingredients.length - 1 ? ", " : "")}
            </span>
          ))}
        </p>
      </div>
    </Link>
  )
}
