'use client';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from '@headlessui/react';
import {
  ChevronDown,
  User,
  Pencil,
  Plus,
  LogOut,
  ShieldUser,
} from 'lucide-react';
import ModalLogout from '../Modals/ModalLogout';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAuth } from '@/hooks/auth/useGetAuth';

export default function Example() {
  const { data } = useGetAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useNavigate();
  if (!data) return null;

  return (
    <>
      <Menu>
        <MenuButton
          title={data.name}
          className="inline-flex outline-0 items-center gap-2 rounded-md bg-foreground/5 px-3 py-1.5 text-sm/6 font-semibold"
        >
          <User />
          <ChevronDown className="size-4 fill-white/60" />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 mt-2 z-[999] origin-top-right rounded-xl border border-foreground/10 bg-background/70 backdrop-blur-lg p-1 text-sm/6 text-foreground transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          {data.role === 'admin' && (
            <MenuItem>
              {({ close }) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router({ to: '/admin' });
                    close();
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-foreground/10"
                >
                  <ShieldUser className="size-4" />
                  Admin
                </button>
              )}
            </MenuItem>
          )}
          {data?.role === 'admin' && (
            <MenuItem>
              <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-foreground/10">
                <Plus className="size-4" />
                Add Products
              </button>
            </MenuItem>
          )}
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-foreground/10">
              <Pencil className="size-4" />
              Edit Profile
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-foreground/10">
              <Pencil className="size-4" />
              Edit Profile
            </button>
          </MenuItem>
          <MenuSeparator className="my-1 h-0.5 rounded-full bg-foreground/10" />
          <MenuItem as={'div'}>
            <button
              onClick={() => {
                setModalOpen(true);
              }}
              className="group text-red-500 font-semibold flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-red-500/10"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <ModalLogout isOpen={isModalOpen} setIsOpen={setModalOpen} />
    </>
  );
}
