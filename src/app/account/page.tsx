"use client"

import getUserData from "@/api/client/getUserData"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import useAuth from "../../hooks/auth"
import { useForm } from "react-hook-form"
import NavWrapper from "../../components/nav"
import onboard from "@/api/client/onboard"

export default function AccountPage() {
  useAuth()

  const { data } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(),
  })

  // const {
  //   handleSubmit,
  //   register,
  //   formState: { isValid },
  // } = useForm()

  // const onSubmit = async (data: any) => {
  //   const { firstName, lastName } = data
  //   await onboard(firstName, lastName)
  // }

  return (
    <NavWrapper>
      <main className="flex flex-col items-center min-h-screen py-8 px-4 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Mon compte</h1>
        <div className="max-w-96">
          {data ? (
            <div>
              <form
                className="flex flex-col items-center justify-center"
                // onSubmit={handleSubmit(onSubmit)}
              >
                <p className="p-2 shadow-2xl shadow-blue-950/15 bg rounded text-justify">
                  Tout ce qu'on a sur toi, c'est que tu t'appelles{" "}
                  {data.firstName} {data.lastName}, que ton n° de téléphone est{" "}
                  {data.phone} et la liste de tes commandes. En plus, tout sera
                  supprimé après les campagnes !
                </p>

                {/* <br/>

                <input
                  className="w-full border border-purple-500 focus:border-purple-800 rounded-md p-2 mb-4"
                  placeholder="Prénom"
                  {...register("firstName", { required: true })}
                />
                <input
                  className="w-full border border-purple-500 focus:border-purple-800 rounded-md p-2 mb-4"
                  placeholder="Nom"
                  {...register("lastName", { required: true })}
                /> */}
              </form>
            </div>
          ) : (
            <p className="p-2 border rounded text-justify">
              Tout ce qu'on a sur toi, c'est ton prénom, ton nom, ton n° de
              téléphone et la liste de tes commandes. En plus, tout sera
              supprimé après les campagnes !
            </p>
          )}
          <p className="text-center mt-4 italic">
            Tu veux supprimer tes données maintenant ? Fais la requête auprès de
            Théo Lartigau (06 41 80 76 58).
          </p>
        </div>
      </main>
    </NavWrapper>
  )
}
