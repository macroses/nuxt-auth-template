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
    // @ts-ignore
    GithubProvider.default({
      clientId: useRuntimeConfig().githubId,
      clientSecret: useRuntimeConfig().githubSecret
    }),
    // @ts-ignore
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleId,
      clientSecret: useRuntimeConfig().googleSecret
    }),
    // @ts-ignore
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email'},
        password: { type: 'password', label: 'password' }
      },
      async authorize (credentials: any): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw createError({
            statusCode: 500,
            statusMessage: 'Missing Info'
          })
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.hashedPassword) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Invalid Credentials'
          })
        }

        const correctPassword = await bcrypt.compare(credentials.password, user.hashedPassword)

        if (!correctPassword) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Invalid Credentials'
          })
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