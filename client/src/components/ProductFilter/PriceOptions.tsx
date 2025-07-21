import PriceSlider from '@/components/PriceSlider'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { ChevronRight } from 'lucide-react'

export default function PriceOptions() {
  return (
    <Disclosure defaultOpen>
      <DisclosureButton
        as="div"
        className="flex group items-center justify-between"
      >
        <h1 className="font-bold text-xl">Price</h1>
        <ChevronRight className="group-data-[open]:-rotate-90" />
      </DisclosureButton>
      <div className="overflow-hidden">
        <DisclosurePanel
          transition
          className="origin-top px-4 transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
        >
          <PriceSlider rtl={false} />
        </DisclosurePanel>
      </div>
    </Disclosure>
  )
}
