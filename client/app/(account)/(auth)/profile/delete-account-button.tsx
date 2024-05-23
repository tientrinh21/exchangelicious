import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { authAtom, getUserData } from '@/lib/auth'
import { deleteUser } from '@/lib/request'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DeleteAccountButton() {
  const router = useRouter()
  const setIsAuth = useSetAtom(authAtom)

  async function handleDeleteAccount() {
    const toastId = toast.loading('Deleting your account...')

    try {
      await deleteUser(getUserData())
      localStorage.removeItem('user')
      setIsAuth(false)
      toast.info('Account deleted! You will be logged out.', { id: toastId })
      router.push('/exchange')
    } catch (error: any) {
      console.error(error)
      toast.error('Something went wrong!', { id: toastId })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAccount}>
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
