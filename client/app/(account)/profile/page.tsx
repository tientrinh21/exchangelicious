'use client'

import { Separator } from '@/components/ui/separator'
import ProfileForm from './profile-form'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const isAuth = useAuth()
  if (!isAuth) router.replace('/sign-in')

  return (
    <div className="container max-w-screen-lg space-y-6 py-5 md:py-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your account information. Set your nationality and home
          university.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}
