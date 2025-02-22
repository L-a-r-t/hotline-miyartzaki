import Image from "next/image"

export default function Background() {
  return (
      <div className="fixed bg-gray-100 top-0 left-0 -z-10 w-screen h-screen overflow-hidden">
          <Image
              src={"/bg/SVG/sun.svg"}
              alt="Sois, le feu et la terre"
              width={300}
              height={300}
              className="absolute animate-float-10 -top-12 -right-12"
          />
          <div className="absolute left-0 w-full h-72" style={{bottom: "-50px"}}>
              <Image
                  src={"/bg/SVG/water_lg_boat.svg"}
                  alt="L'eau et la poussière"
                  fill
                  className="object-cover animate-float-10"
              />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-72">
              <Image
                  src={"/bg/SVG/water_lg.svg"}
                  alt="L'eau et la poussière"
                  fill
                  className="object-cover"
              />

          </div>
      </div>
  )
}
