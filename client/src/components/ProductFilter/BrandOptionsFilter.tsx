'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Radio,
  RadioGroup,
} from '@headlessui/react'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function BrandOptions() {
  const sizes = ['AMD', 'AOC', 'Asus', 'AsRock', 'Gigabyte', 'MSI', 'Intel']

  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section className="space-y-4">
      <Disclosure defaultOpen>
        <DisclosureButton
          as="div"
          className="flex group items-center justify-between"
        >
          <h1 className="font-bold text-xl">Brand</h1>
          <ChevronRight className="group-data-[open]:-rotate-90" />
        </DisclosureButton>
        <div className="overflow-hidden">
          <DisclosurePanel
            transition
            className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
          >
            <RadioGroup
              value={selected}
              onChange={setSelected}
              aria-label="Server size"
              className="flex flex-wrap items-center gap-2"
            >
              {sizes.map((brand) => (
                <Field key={brand} className="flex items-center gap-2">
                  <Radio
                    value={brand}
                    className="group cursor-pointer flex items-center justify-center rounded-full appearance-none"
                  >
                    <div
                      className="w-full flex items-center justify-center h-full rounded-full px-6 py-2 border border-foreground/20"
                      style={{
                        color: selected === brand ? '#f0f0f0' : '#000',
                        background: selected === brand ? '#000' : '#f0f0f0',
                      }}
                    >
                      {brand}
                    </div>
                  </Radio>
                </Field>
              ))}
            </RadioGroup>
          </DisclosurePanel>
        </div>
      </Disclosure>
    </section>
  )
}
