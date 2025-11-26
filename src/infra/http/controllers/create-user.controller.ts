import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common"
import bcrypt from "bcryptjs"
import { z } from "zod"

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  cpf: z.string(),
  password: z.string(),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller("/users")
export class CreateUserController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: CreateUserBodySchema) {
    const { name, email, cpf, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException("User with same e-mail already exists.")
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    await this.prisma.user.create({
      data: {
        name,
        email,
        cpf,
        password: hashedPassword,
      },
    })
  }
}
