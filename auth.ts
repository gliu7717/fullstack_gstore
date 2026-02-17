/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import type { NextAuthConfig } from 'next-auth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, //30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' }
            },
            async authorize(credentials) {
                if (credentials == null) return null;
                //Find user in database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                });
                // check if user exists and if password matches
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password)
                    // if password is correct return user
                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }
                // not match or no password
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, user, trigger, token }: any) {
            // Set the user id from token
            session.user.id = token.sub;
            // if there is an update, set the user name
            if (trigger == 'update') {
                session.user.name = user.name
            }
            return session
        },
        authorized({ request, auth }: any) {
            // Check for cart cookie
            if (!request.cookies.get('sessionCartId')) {
                // Generate cart cookie
                const sessionCartId = crypto.randomUUID();
                console.log('Generated sessionCartId:', sessionCartId);

                // Clone the request headers
                const newRequestHeaders = new Headers(request.headers);

                // Create a new response and add the new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders,
                    },
                });

                // Set the newly generated sessionCartId in the response cookies
                response.cookies.set('sessionCartId', sessionCartId);

                // Return the response with the sessionCartId set
                return response;
            } else {
                return true;
            }
        },
    }
} satisfies NextAuthConfig
export const { handlers, auth, signIn, signOut } = NextAuth(config);