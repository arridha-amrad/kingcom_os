'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

function SpecialOfferAlert() {
  const [isShow, setIsShow] = useState(true)

  const toggleAlert = () => {
    setIsShow((val) => !val)
  }

  if (!isShow) return null

  return (
    <section className="bg-foreground text-background mx-4">
      <div className="h-[2.4rem] px-4 mx-auto flex items-center justify-center gap-4">
        <p className="text-center text-sm md:text-base">
          Sign up and get 20% off to your first order.
          <span className="pl-1 underline font-semibold">Sign Up Now</span>
        </p>
        <button onClick={toggleAlert}>
          <X />
        </button>
      </div>
    </section>
  )
}

export default SpecialOfferAlert
