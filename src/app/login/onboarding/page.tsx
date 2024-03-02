"use client"

import onboard from "@/api/client/onboard"
import Background from "@/components/background"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

const OnboardingPage = () => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm()
  const router = useRouter()

  const onSubmit = async (data: any) => {
    const { firstName, lastName } = data
    await onboard(firstName, lastName)
    router.push("/")
  }

  return (
    <main className="flex flex-col min-h-screen items-center p-8 py-8 pb-16 md:py-16 gap-8 bg-blue-50">
      <Image src={"/logo.svg"} alt="Logo" width={100} height={100} />
      <div className="flex-grow flex flex-col justify-between max-w-96 rounded-3xl p-8 bg-white bg-opacity-50 backdrop-blur-sm shadow-2xl shadow-blue-950/15">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Un dernier effort
          </h1>
          <p className="text-sm md:text-base text-center">
            Donne nous ton nom et ton prénom pour qu'on puisse te reconnaître !
          </p>
        </div>
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className="w-full border border-blue-500 focus:border-blue-800 rounded-md p-2 mb-4"
            placeholder="Prénom"
            {...register("firstName", { required: true })}
          />
          <input
            className="w-full border border-blue-500 focus:border-blue-800 rounded-md p-2 mb-4"
            placeholder="Nom"
            {...register("lastName", { required: true })}
          />
          <button
            disabled={!isValid}
            className="w-full bg-blue-600 bg-opacity-80 disabled:bg-gray-500 disabled:bg-opacity-60 text-white font-semibold rounded-md p-2"
          >
            Théo bouge de là je veux ma crêpe
          </button>
        </form>
      </div>
    </main>
  )
}

export default OnboardingPage
