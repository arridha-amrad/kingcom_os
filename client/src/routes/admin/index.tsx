import FormAddProduct from '@/components/Forms/products/FormCreateProduct';
import { cn } from '@/utils';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
});

const className = {
  tab: 'flex-1 rounded-full w-fit outline-none focus:not-data-focus:outline-none data-focus:outline data-focus:outline-foreground data-hover:bg-foreground/5 data-selected:bg-foreground/10 data-selected:data-hover:bg-foreground/10',
};

function RouteComponent() {
  return (
    <main className="w-full py-8 px-4">
      <TabGroup className="rounded-xl min-h-[500px]">
        <TabList className="h-14 flex gap-x-8">
          <Tab className={cn(className.tab)}>Add Product</Tab>
          <Tab className={cn(className.tab)}>Manage Users</Tab>
          <Tab className={cn(className.tab)}>Sales</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormAddProduct />
          </TabPanel>
          <TabPanel>Content 2</TabPanel>
          <TabPanel>Content 3</TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
