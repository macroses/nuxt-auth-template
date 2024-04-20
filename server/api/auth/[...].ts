import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default NuxtAuthHandler({
  adapter: PrismaAdapter(prisma),
  secret: 'your-secret-here',
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: useRuntimeConfig().githubId,
      clientSecret: useRuntimeConfig().githubSecret
    }),
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleId,
      clientSecret: useRuntimeConfig().googleSecret
    }),
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email'},
        password: { type: 'password', label: 'password' }
      },
      async authorize (credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw createError(500, 'Missing required fields')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.hashedPassword) {
          throw createError(501, 'Invalid credentials')
        }

        const correctPassword = await bcrypt.compare(credentials.password, user.hashedPassword)

        if (!correctPassword) {
          throw createError(501, 'Invalid credentials')
        }

        return user
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/'
  },
  session: {
    strategy: 'jwt'
  }
})