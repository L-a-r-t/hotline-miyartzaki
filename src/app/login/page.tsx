"use client"

import { useRouter } from "next/navigation"
import { useContext, useEffect, useMemo, useState } from "react"
import { auth } from "@/config/firebase"
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"
import Image from "next/image"
import { AuthContext } from "../../context/auth"
import countriesList from "../../../public/countries.json"
import { Listbox } from "@headlessui/react"
import Spinner from "../../components/spinner"
import Background from "@/components/background"

const LoginPage = () => {
  const countries = countriesList as {
    name: string
    dial_code: string
    flag: string
    code: string
  }[]
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [country, setCountry] = useState(countries[73])
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [verifier, setVerifier] = useState<RecaptchaVerifier | null>(null)
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null)

  useEffect(() => {
    setVerifier(
      new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
      })
    )
  }, [])

  const validPhone = useMemo(() => {
    const phoneRegex = /^0?[1-9][0-9]{8}$/
    const phoneRegex11 = /^0?[1-9][0-9]{10}$/
    return (
      phone.match(phoneRegex)?.[0] != null ||
      phone.match(phoneRegex11)?.[0] != null
    )
  }, [phone])

  const trimmedPhone = useMemo(
    () => (phone[0] === "0" ? phone.slice(1) : phone),
    [phone]
  )

  const validCode = useMemo(() => {
    return code.length == 6
  }, [code])

  const sendCode = async () => {
    try {
      if (!verifier) return
      setLoading(true)
      await verifier.verify()

      signInWithPhoneNumber(auth, country.dial_code + trimmedPhone, verifier)
        .then((confirmationResult) => {
          setConfirmationResult(confirmationResult)
        })
        .catch((error) => {
          console.error(error)
          switch (error.code) {
            case "auth/invalid-phone-number":
              setError("Numéro de téléphone invalide")
              break
            case "auth/too-many-requests":
              setError("Trop de tentatives, réessaye plus tard")
              break
            case "auth/code-expired":
              setError("Code expiré")
              break
            default:
              setError("Une erreur est survenue")
              break
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (err) {
      console.error(err)
      setError("Une erreur est survenue")
      setLoading(false)
    }
  }

  const refreshPage = () => {
    router.refresh()
  }

  const confirmCode = async () => {
    try {
      setLoading(true)
      const res = await confirmationResult?.confirm(code)
      if (res?.user && res?.user.displayName) router.replace("/")
      if (res?.user && !res?.user.displayName)
        router.replace("/login/onboarding")
    } catch (err) {
      console.error(err)
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  if (user != "loading" && user != null && user.displayName) router.replace("/")

  if (!confirmationResult)
    return (
      <main className="flex flex-col min-h-screen items-center p-8 py-8 pb-16 md:py-16 gap-8">
        <Image src={"/logo.svg"} alt="Logo" width={100} height={100} />
        <div className="flex-grow flex flex-col justify-between max-w-96 rounded-3xl p-8 bg-white bg-opacity-50 backdrop-blur-sm shadow-2xl shadow-purple-950/15">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Connexion</h1>
            <p className="text-center">
              Connecte-toi à l'aide de ton n° de téléphone (celui associé à ton
              compte Lydia si tu en as un)
            </p>
          </div>
          <form
            className="flex flex-col items-center justify-center"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="relative flex items-between w-full">
              <Listbox value={country} onChange={setCountry}>
                <Listbox.Button className="flex-[1] bg-gray-50 border-t border-l border-b border-blue-500 focus:border-blue-800 rounded-l-md mb-4 whitespace-nowrap px-2">
                  {country.dial_code}
                </Listbox.Button>
                <Listbox.Options className="absolute border border-blue-500 bottom-8 h-64 bg-white overflow-y-scroll">
                  {countries.map((c) => (
                    <Listbox.Option
                      key={c.code}
                      value={c}
                      className={
                        "ui-active:bg-purple-100 hover:bg-purple-100 px-2 py-1"
                      }
                    >
                      {c.flag} {c.name} ({c.dial_code})
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-[4] w-full bg-gray-50 border border-blue-500 focus:border-blue-800 rounded-r-md p-2 mb-4"
                placeholder="6******58"
              />
            </div>
            <button
              id="sign-in-button"
              disabled={!validPhone || error !== null || loading}
              onClick={sendCode}
              className="w-full flex justify-center items-center bg-blue-600 bg-opacity-80 disabled:bg-gray-500 disabled:bg-opacity-60 text-white font-semibold rounded-md p-2"
            >
              Connexion{loading && <Spinner className="border-white ml-2" />}
            </button>
            {error && (
              <p className="text-red-500 w-full font-semibold">{error}</p>
            )}
            {error && (
              <button
                onClick={refreshPage}
                className="w-full bg-blue-600 bg-opacity-80 text-white font-semibold rounded-md p-2"
              >
                Actualiser
              </button>
            )}
          </form>
        </div>
      </main>
    )

  return (
    <main className="flex flex-col min-h-screen items-center p-8 py-8 pb-16 md:py-16 gap-8 bg-gray-100">
      <Image src={"/logo.svg"} alt="Logo" width={100} height={100} />
      <div className="flex-grow flex flex-col justify-between max-w-96 rounded-3xl p-8 bg-white bg-opacity-50 backdrop-blur-sm shadow-2xl shadow-blue-950/15">
        <p>
          Un code a été envoyé par SMS au{" "}
          <span className="font-semibold underline">
            {country.dial_code + trimmedPhone}
          </span>
          , renseigne-le ici pour te connecter !
        </p>
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-blue-500 focus:border-blue-800 rounded-md p-2 mb-4"
            placeholder="123456"
          />
          <button
            id="sign-in-button"
            disabled={!validCode || error !== null || loading}
            onClick={confirmCode}
            className="w-full flex justify-center items-center bg-blue-600 bg-opacity-80 disabled:bg-gray-500 disabled:bg-opacity-60 text-white font-semibold rounded-md p-2"
          >
            Valider{loading && <Spinner className="border-white ml-2" />}
          </button>
        </form>
        {error && <p className="text-red-500 w-full font-semibold">{error}</p>}
        {error && (
          <button
            onClick={refreshPage}
            className="w-full bg-blue-600 bg-opacity-80 text-white font-semibold rounded-md p-2"
          >
            Actualiser
          </button>
        )}
      </div>
    </main>
  )
}

export default LoginPage
