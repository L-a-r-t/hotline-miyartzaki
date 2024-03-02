"use client"

import { useRouter } from "next/navigation"
import {
  Fragment,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import { AuthContext } from "../../context/auth"
import Link from "next/link"
import Image from "next/image"
import { Transition } from "@headlessui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"

export default function AdminLayout({ children }: PropsWithChildren) {
  const { isAdmin, user } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (user == "loading") return
    if (isAdmin === false) router.replace("/")
  }, [user, isAdmin])

  if (isAdmin !== true) return null

  return (
    <div className="flex lg:pl-80">
      <nav className="fixed z-10 top-0 left-0 min-h-screen hidden lg:flex flex-col items-center p-8 gap-8 w-80 min-w-80 bg-md">
        <Image src={"/logo.svg"} alt="Logo" width={100} height={100} />
        <ul className="w-full flex flex-col items-baseline justify-center gap-4 list-none">
          <li className="w-full">
            <Link
              className="w-full transition bg-white hover:border-gray-500 border border-gray-300 font-semibold flex justify-center items-center p-4 rounded cursor-pointer"
              href="/admin/orders"
            >
              Commandes
            </Link>
          </li>
          <li className="w-full">
            <Link
              className="w-full transition bg-white hover:border-gray-500 border border-gray-300 font-semibold flex justify-center items-center p-4 rounded cursor-pointer"
              href="/admin/meals"
            >
              Ingrédients
            </Link>
          </li>
          {/* <li className="w-full">
            <Link
              className="w-full transition bg-white hover:border-gray-500 border border-gray-300 font-semibold flex justify-center items-center p-4 rounded cursor-pointer"
              href="/admin/menus"
            >
              Menus
            </Link>
          </li> */}
          <li className="w-full">
            <Link
              className="w-full transition bg-white hover:border-gray-500 border border-gray-300 font-semibold flex justify-center items-center p-4 rounded cursor-pointer"
              href="/admin/hotlines"
            >
              Hotlines
            </Link>
          </li>
          <li className="w-full">
            <Link
              className="w-full transition bg-cyan-200 hover:border-gray-500 border border-cyan-300 font-semibold flex justify-center items-center p-4 rounded cursor-pointer"
              href="/"
            >
              Retour au site
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-grow flex flex-col">{children}</main>
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
            className="bg-md h-full max-w-96 w-5/6 py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-4 w-full flex justify-center">
              <Image src={"/logo.svg"} alt="Logo" width={80} height={80} />
            </div>
            <Link
              className="flex items-center h-12 px-8 font-medium"
              href="/admin/orders"
            >
              Commandes
            </Link>
            <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />
            <Link
              className="flex items-center h-12 px-8 font-medium"
              href="/admin/meals"
            >
              Ingrédients
            </Link>
            {/* <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />
            <Link
              className="flex items-center h-12 px-8 font-medium"
              href="/admin/menus"
            >
              Menus
            </Link> */}
            <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />
            <Link
              className="flex items-center h-12 px-8 font-medium"
              href="/admin/hotlines"
            >
              Hotlines
            </Link>
            <div className="mx-auto w-1/2 h-[1px] bg-gray-400" />
            <Link className="flex items-center h-12 px-8 font-medium" href="/">
              Retour au site
            </Link>
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
          className={`lg:hidden block absolute top-4 right-4`}
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
          className="lg:hidden block fixed top-4 right-4"
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-lg w-6 h-6 md:h-8 md:w-8"
          />
        </button>
      </Transition>
    </div>
  )
}
