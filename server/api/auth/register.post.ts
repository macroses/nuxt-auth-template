import { PrismaClient } from "@prisma/client"
import { H3Event } from "h3"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { name, email, password } = await readBody(event)
    console.log(name, email, password)

    if (!name || !email || !password) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing required fields'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword
      }
    })

    return { user }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong. Please try again later.'
    })
  }
})