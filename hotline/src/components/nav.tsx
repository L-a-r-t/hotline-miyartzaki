import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Transition } from "@headlessui/react"
import Image from "next/image"
import Link from "next/link"
import { Fragment, PropsWithChildren, useContext, useState } from "react"
import ModalWrapper from "./modal"
import { AuthContext } from "@/context/auth"

export default function NavWrapper({ children }: PropsWithChildren) {
  const { isAdmin, user } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <ModalWrapper>{children}</ModalWrapper>
      <Transition
        as={Fragment}
        show={menuOpen}
        enter="transition-transform duration-300 ease-out"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 ease-in"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div
          className="fixed top-0 right-0 h-full w-full flex justify-end"
          onClick={() => setMenuOpen(false)}
        >
          <menu
            className="bg-md h-full max-w-96 w-5/6 border-l py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-4 w-full flex justify-center">
              <Image src={"/logo.svg"} alt="Logo" width={80} height={80} />
            </div>
            <Link className="flex items-center h-12 px-8 font-medium" href="/">
              Hotline
            </Link>
            <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />
            <Link
              className="flex items-center h-12 px-8 font-medium"
              href="/account/orders"
            >
              Mes commandes
            </Link>
            <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />
            <Link
              className="flex items-center h-12 px-8 font-medium"
              href="/account"
            >
              Mon compte
            </Link>
            {isAdmin && <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />}
            {isAdmin && (
              <Link
                className="flex items-center h-12 px-8 font-medium"
                href="/admin"
              >
                Administration
              </Link>
            )}
            {/* <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />
            <Link
              className="flex items-center h-12 px-8 font-medium"
              href="/about"
            >
              A propos
            </Link>
            <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />
            <Link
              className="flex items-center h-12 px-8 font-medium"
              href="/legal"
            >
              Mentions légales
            </Link> */}
          </menu>
        </div>
      </Transition>
      <Transition
        as={Fragment}
        show={!menuOpen}
        enter="transition-all duration-[400ms] ease-in-out"
        enterFrom="opacity-0 scale-0"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-[400ms] ease-in-out"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
      >
        <button
          onClick={() => setMenuOpen(true)}
          className={`absolute top-4 right-4`}
        >
          <FontAwesomeIcon
            icon={faBars}
            className="text-lg w-6 h-6 md:h-8 md:w-8"
          />
        </button>
      </Transition>
      <Transition
        as={Fragment}
        show={menuOpen}
        enter="transition-all duration-[400ms] ease-in-out"
        enterFrom="scale-0"
        enterTo="scale-100"
        leave="transition-all duration-[400ms] ease-in-out"
        leaveFrom="scale-100"
        leaveTo="scale-0"
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="fixed top-4 right-4"
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-lg w-6 h-6 md:h-8 md:w-8"
          />
        </button>
      </Transition>
    </>
  )
}
