"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { enrollUserInCurso, addUserPurchase, inscribirEnCursoAPI } from "@/lib/data"

export interface CheckoutItem {
  id: string
  type: "course" | "product"
  title: string
  price: number
  image: string
  quantity: number
}

interface CheckoutContextType {
  items: CheckoutItem[]
  addItem: (item: CheckoutItem) => void
  removeItem: (id: string) => void
  clearItems: () => void
  total: number
  itemCount: number
  processCheckout: () => Promise<void>
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CheckoutItem[]>([])
  const { user, token } = useAuth()

  const addItem = (item: CheckoutItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === item.type)
      if (existing) {
        return prev.map(i => 
          i.id === item.id && i.type === item.type 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearItems = () => {
    setItems([])
  }

  const processCheckout = async () => {
    if (!user) return

    // Enroll in courses and save product purchases
    for (const item of items) {
      if (item.type === "course") {
        if (token) {
          await inscribirEnCursoAPI(token, item.id)
        }
        enrollUserInCurso(user.id, item.id)
      } else if (item.type === "product") {
        addUserPurchase(user.id, {
          productId: item.id,
          productName: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })
      }
    }

    clearItems()
  }

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const itemCount = items.length

  return (
    <CheckoutContext.Provider value={{ items, addItem, removeItem, clearItems, total, itemCount, processCheckout }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}