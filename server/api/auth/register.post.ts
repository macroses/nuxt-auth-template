import { PrismaClient } from "@prisma/client"
import { H3Event } from "h3"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { name, email, password } = await readBody(event)
    console.log(name, email, password)

    if (!name || !email || !password) {
      throw createError(500, 'Missing required fields')
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
    throw createError(500, 'Something went wrong.')
  }
})