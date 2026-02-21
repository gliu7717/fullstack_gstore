'use server'
import { signInFormSchema, signUpFormSchema, shippingAddressSchema } from "../validators"
import { auth, signIn, signOut } from '@/auth'
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from '@/db/prisma'
import { formatError } from "../utils"
import { ShippingAddress } from "@/types"
// Sign in the user with credentials
export async function signInWithCredentials(preState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        })
        await signIn('credentials', user);
        return { success: true, message: 'Signed in successfully' }
    } catch (error) {

        console.log(error);
        //console.log(error.flatten().fieldErrors);

        if (isRedirectError(error)) {
            throw error
        }
        return { success: false, message: formatError(error) }
    }
}

// Sign use out
export async function signOutUser() {
    try {
        await signOut({ redirectTo: '/' });
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        throw error;
    }
}

// sign up user
export async function signUpUser(preState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        })
        const plainPassword = user.password
        user.password = hashSync(user.password, 10)
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            },
        })
        await signIn('credentials', {
            email: user.email,
            password: plainPassword,
        })
        return { success: true, message: 'User registered successfully' }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return { success: false, message: 'User was not registered' }
    }
}

// Get user by the id
export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId },
    })
    if (!user) throw new Error('User not found')
    return user
}

// update the user's address
export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        });
        if (!currentUser) throw new Error("User not found");
        const address = shippingAddressSchema.parse(data);
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { address }
        });
        return {
            success: true,
            message: 'User updated successfully'
        }
    } catch (error) {
        return { success: false, message: formatError(error) }
    }

}