'use client'

import { signOutUser } from '@/lib/actions/user.actions'
import { Button } from '@/components/ui/button'

export function SignOutForm() {
    return (
        <form
            action={signOutUser}
            className="w-full"
            onSubmit={(e) => {
                e.preventDefault()
                signOutUser()
            }}
        >
            <Button type="submit" className="w-full py-4 px-2 h-4 justify-start" variant="ghost">
                Sign Out
            </Button>
        </form>
    )
}
