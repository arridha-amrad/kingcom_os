import Brands from '@/components/Brands'
import HomeHero from '@/components/Hero'
import NewArrivals from '@/components/ShowCases/NewArrivals'
import OnSale from '@/components/ShowCases/OnSale'
import TopSelling from '@/components/ShowCases/TopSelling'
import Testimony from '@/components/Testimony'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full">
      <HomeHero />
      <Brands />
      <OnSale />
      <NewArrivals />
      <TopSelling />
      <Testimony />
    </div>
  )
}
