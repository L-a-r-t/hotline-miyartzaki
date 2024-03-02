import { values } from "@/utils/functions"
import { Menu } from "@/utils/types"
import Link from "next/link"

export default function AdminMenuItem(menu: Menu) {
  return (
    <Link href={"/admin/menus/" + menu.id}>
      <div className="flex flex-col gap-2 p-4 rounded bg cursor-pointer w-64 max-w-64">
        <p className="font-semibold">{menu.name}</p>
        {Object.keys(menu.content).map((section) => (
          <div key={menu.id + section}>
            <p>
              {section} ({menu.content[section].maxQty} max)
            </p>
            <p className="text-xs">
              {values(menu.content[section].meals).map((meal, i) => (
                <span key={menu.id + section + meal.id}>
                  {meal.name}
                  {i < values(menu.content[section].meals).length - 1
                    ? ", "
                    : ""}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </Link>
  )
}
