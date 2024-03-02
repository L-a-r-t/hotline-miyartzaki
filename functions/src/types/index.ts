type ID<T = unknown> = string
type URL = string
type DateTime = { seconds: number; nanoseconds: number }

export type GlobalState = {
  hotline: {
    active: true
  }
  delivery: {
    currentPlace?: string
  }
}

type Address = {
  address: {
    lon: number
    lat: number
    address: string
    city: string
    zip: string
  }
  room?: string
  additionnalInfo?: string
}

export type DeliveryOption = {
  place: string
  hour: string
  stock: number
}

export type DaySettings = {
  day: string
  maxDeliveries: number
  options: DeliveryOption[]
}

export type UserData = {
  firstName: string
  lastName: string
  phone: string
  isAdmin?: boolean
  orders: ID<Order>[]
}

export type Menu = {
  id: ID
  name: string
  desc: string
  content: {
    [key: string]: {
      maxQty: number
      meals: Record<
        number,
        {
          id: ID<MealData>
          name: string
        }
      >
    }
  }
  day: string
  price: number
} & (
  | {
      type: "breakfast" | "lunch" | "diner"
    }
  | {
      type: "hotline"
      content: {
        [key: string]: {
          maxQty: number // for compatibility concerns
          meals: Record<
            number,
            MealData & {
              stock: number
              qty: number
            }
          >
        }
      }
    }
)

export type HotlineMenu = Omit<Menu, "content"> & {
  content: {
    [key: string]: {
      meals: Record<
        number,
        MealData & {
          stock: number
          qty: number
        }
      >
    }
  }
}

export type FullMenu = Omit<Menu, "content"> & {
  content: {
    [key: string]: {
      qty: number
      maxQty: number
      meals: Record<number, MealData>
    }
  }
  selected?: boolean
}

export type MealData = {
  id: ID
  name: string
  img: URL
  ingredients: string[]
  desc: string
  price: number
  isVegetarian: boolean
  qty?: number
}

export type OrderRecap = Record<
  string,
  {
    price: number
    items: {
      time: string
      menu: string
      menuId: string
      section: string
      meal: string
      mealId: string
      price: number
      qty: number
    }[]
  }
>

export type ReservationData = {
  menus: {
    [key: string]: {
      name: string
      content: {
        [key: string]: {
          id: ID<MealData>
          name: string
          qty: number
        }
      }
      type: "breakfast" | "lunch" | "diner"
      status: "pending" | "delivered"
      qty: number
    }
  }
}

export type Order = {
  id: ID
  shortId: string
  author: ID
  authorData?: {
    firstName: string
    lastName: string
    phone: string
  }
  price: number
  day: string
  reservationTime: DateTime
  status: "pending" | "preparation" | "delivery" | "delivered" | "cancelled"
  menus: {
    [key: string]: {
      name: string
      content: {
        [key: string]: {
          id: ID<MealData>
          name: string
          qty: number
          price: number
        }
      }
      type?: "breakfast" | "lunch" | "diner"
      status?: "pending" | "delivered"
    }
  }
} & (
  | ({
      type: "hotline"
    } & Address)
  | { type: "diner"; deliveryTime: string; deliveryPlace: string }
  | ({ type: "diner2" } & Address)
  | {
      type: "lunch"
    }
) &
  LegacyOrder

type LegacyOrder = {
  preparationTime: DateTime
  deliveryTime: DateTime
  askedDeliveryTime?: string
  chamber?: string
} & (
  | ({ ordertype: "reservation" } & ReservationData)
  | ({ ordertype: "order" } & OrderData)
)

export type OrderData = {
  address: {
    lon: number
    lat: number
    address: string
    city: string
    zip: string
  }
}

export type DayDelta = 0 | 1 | 2 | 3 | 4 | 5 | 6
