import { CourierAlreadyExistsError } from "@/domain/carrier/application/use-cases/errors/courier-already-exists-error"
import { RegisterCourierUseCase } from "@/domain/carrier/application/use-cases/register-courier"
import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common"
import { z } from "zod"

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  cpf: z.string(),
  password: z.string(),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller("/accounts")
@Public()
export class CreateAccountController {
  constructor(private registerCourier: RegisterCourierUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: CreateUserBodySchema) {
    const { name, email, cpf, password } = body

    const result = await this.registerCourier.execute({
      name,
      email,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CourierAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
