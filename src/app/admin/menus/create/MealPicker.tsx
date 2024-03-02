// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faSort } from "@fortawesome/free-solid-svg-icons/faSort"
import { Combobox, Transition } from "@headlessui/react"
import { useState, Fragment } from "react"
import { MealData } from "@/utils/types"
import { faLeaf, faSort } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function MealPicker({
  options,
  lookup,
  selected: _selected,
  index,
  select,
  unselect,
  max,
}: Props) {
  const [query, setQuery] = useState("")

  const filtered =
    query === ""
      ? options.filter((option) => !_selected.includes(option))
      : [
          ...options.filter(
            (option) =>
              !_selected.includes(option) &&
              lookup[option].name
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(query.toLowerCase().replace(/\s+/g, ""))
          ),
        ]

  return (
    <Combobox value={""} onChange={(e) => select(e, index)} as={Fragment}>
      <div className="relative mt-1">
        <div
          className={`${_selected.length < 3 && "input min-h-[2.25rem]"}
        relative cursor-default text-left sm:text-sm flex items-center flex-wrap pr-10 gap-2`}
        >
          {_selected.map((option) => {
            const key =
              options.reduce(
                (acc, curr) => (acc = curr == option ? curr : acc),
                false as string | false
              ) || option
            return (
              <span
                key={option}
                onClick={() => unselect(option, index)}
                className="py-1 px-3 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium cursor-pointer"
              >
                {lookup[key].name}
                {lookup[option].isVegetarian && (
                  <FontAwesomeIcon
                    icon={faLeaf}
                    className="text-green-700 ml-2"
                  />
                )}
              </span>
            )
          })}
          {_selected.length < max && (
            <>
              <Combobox.Input
                className="bg-transparent border-b border-gray-500 text-sm w-24 leading-5 text-gray-900"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button
                type="button"
                className="absolute right-1 top-2.5 flex items-center pr-2"
              >
                <FontAwesomeIcon
                  icon={faSort}
                  className="text-lg text-main-50"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </>
          )}
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.length === 0 && query !== "" ? (
              <Combobox.Option
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-gray-200 text-black" : "text-black"
                  }`
                }
                value={query}
              >
                <span className="block">{query}</span>
              </Combobox.Option>
            ) : (
              filtered.map((option) => (
                <Combobox.Option
                  key={`${option}option`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? "bg-gray-200 text-black" : "text-black"
                    }`
                  }
                  value={option}
                >
                  <div className="truncate flex justify-between">
                    <p>
                      {lookup[option].name}
                      {lookup[option].isVegetarian && (
                        <FontAwesomeIcon
                          icon={faLeaf}
                          className="text-green-700 ml-2"
                        />
                      )}
                    </p>
                    {/* {category.quizzes && (
                      <p className="text-black/50">{category.quizzes}</p>
                    )} */}
                  </div>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

type Props = {
  lookup: Record<string, MealData>
  options: string[]
  selected: string[]
  index: number
  select: (option: string, sectionIndex: number) => void
  unselect: (option: string, sectionIndex: number) => void
  max: number
}
