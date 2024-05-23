'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import DeleteAccountButton from './delete-account-button'
import ProfileForm from './profile-form'

export default function ProfilePage() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>
            Update your account information. Set your nationality and home
            university.
          </CardDescription>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-2">
        <ProfileForm />
        <DeleteAccountButton />
      </CardContent>
    </Card>
  )
}
