'use client'

import { Search, ShoppingCart } from 'lucide-react'
import ButtonSearch from './Button/ButtonSearch'
import { Link, useNavigate } from '@tanstack/react-router'
import ButtonUser from './Button/ButtonUser'
import ButtonTheme from './Button/ButtonTheme'

function Header() {
  const navigate = useNavigate()
  return (
    <header className="h-[6rem] sticky top-0 bg-background/70 backdrop-blur z-50 shrink-0 w-full px-4 flex items-center gap-4">
      <div className="flex-1">
        <h1
          onClick={() => navigate({ to: '/' })}
          className="font-header cursor-pointer font-bold tracking-wide block text-4xl pb-1"
        >
          KingCom
        </h1>
      </div>
      <div className="flex-4 flex items-center justify-center gap-4">
        <ul className="items-center shrink-0 justify-center gap-4 hidden md:flex">
          <li>
            <Link to="/products">Shop</Link>
          </li>
          <li>
            <a href="#on_sale">On Sale</a>
          </li>
          <li>
            <a href="#new_arrival">New Arrivals</a>
          </li>
          <li>
            <a href="#brands">Brands</a>
          </li>
        </ul>
        <div className="relative w-full xl:max-w-[400px] hidden lg:block lg:max-w-sm">
          <input
            className="bg-foreground/10 pl-12 outline-0 w-full px-4 h-[3rem] rounded-full"
            name="search"
            placeholder="Search for products..."
            type="text"
          />
          <div className="absolute top-0 left-0 aspect-square">
            <button className="h-[3rem] flex items-center justify-center aspect-square rounded-full">
              <Search className="stroke-foreground/20" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="block lg:hidden pt-1">
          <ButtonSearch />
        </div>
        <button>
          <ShoppingCart />
        </button>
        <ButtonUser />
        <div className="h-[20px] w-1 bg-foreground/10 rounded-full" />
        <ButtonTheme />
      </div>
    </header>
  )
}

export default Header
