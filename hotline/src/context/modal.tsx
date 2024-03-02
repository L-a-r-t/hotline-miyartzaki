"use client"

import { MealData } from "@/utils/types"
import { createContext, useState } from "react"

export const ModalContext = createContext<ModalContextValue>(null as any)

type ModalContextValue = {
  modalOpen: boolean
  modal: Modal
  openModal: (content: string) => void
  openModalWithMeal: (meal: MealData) => void
  closeModal: () => void
}

export default function ModalContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modal, setModal] = useState<Modal>({ type: "text", text: "" })

  const openModal = (content: string) => {
    setModal({
      type: "text",
      text: content,
    })
    setModalOpen(true)
  }

  const openModalWithMeal = (meal: MealData) => {
    setModal({
      type: "meal",
      meal,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <ModalContext.Provider
      value={{ modalOpen, modal, openModal, openModalWithMeal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  )
}

type Modal =
  | {
      type: "text"
      text: string
    }
  | {
      type: "meal"
      meal: MealData
    }
