'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authAtom, getUserData, useAuth } from '@/lib/auth'
import { ExitIcon, FileTextIcon, PersonIcon } from '@radix-ui/react-icons'
import { useSetAtom } from 'jotai/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

export function AccountButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const isAuth = useAuth()
  const setIsAuth = useSetAtom(authAtom)
  const user = isAuth ? getUserData() : undefined

  function handleLogout() {
    localStorage.removeItem('user')
    setIsAuth(false)
    toast.success('Logged out', { duration: 1000 })
    router.push('/exchange')
  }

  return (
    <>
      {isAuth ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="order-1 rounded-lg px-3 text-base md:px-5">
              <PersonIcon className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
              <span className="text-sm md:text-base">{user?.username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="mt-1 space-y-2 rounded-lg px-2 py-4 shadow-xl"
          >
            <DropdownMenuItem>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className={`flex w-full items-center justify-center text-center text-base font-medium text-accent-foreground`}
              >
                <Button
                  variant="link"
                  className="text-accent-foreground hover:no-underline"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="link"
                className="flex w-full items-center justify-center text-center text-base font-medium text-destructive hover:no-underline"
                onClick={handleLogout}
              >
                <ExitIcon className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link className="order-1" href="/sign-in">
          <Button className="rounded-lg text-base">Sign in</Button>
        </Link>
      )}
    </>
  )
}
