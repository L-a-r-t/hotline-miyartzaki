import { Fragment, ReactNode, PropsWithChildren, useContext } from "react"
import { ModalContext } from "../context/modal"
import { Dialog, Transition } from "@headlessui/react"
import { MealData } from "@/utils/types"

export default function ModalWrapper({ children }: PropsWithChildren) {
  const { modalOpen, closeModal, modal } = useContext(ModalContext)

  return (
    <>
      {children}
      <Transition show={modalOpen} as={Fragment}>
        <Dialog
          onClose={closeModal}
          className="flex items-center justify-center w-screen h-screen fixed inset-0 z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-150 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-150 ease-out"
            enterFrom="transform scale-0"
            enterTo="transform scale-100"
            leave="transition-transform duration-150 ease-in"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-0"
          >
            <Dialog.Panel className="realtive z-10 bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              {modal.type == "text" && modal.text}
              {modal.type == "meal" && <MealInfo meal={modal.meal} />}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

const MealInfo = ({ meal }: { meal: MealData }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold">
        {meal.name + (meal.isVegetarian ? " (végétarien)" : "")}
      </h3>
      <p className="text-gray-500">{meal.desc}</p>
      <p>
        {meal.ingredients.map((ingredient, i) => (
          <span className="text-sm" key={ingredient + String(i)}>
            {(i == 0 ? ingredient : ingredient.toLowerCase()) +
              (i < meal.ingredients.length - 1 ? ", " : "")}
          </span>
        ))}
      </p>
    </div>
  )
}
