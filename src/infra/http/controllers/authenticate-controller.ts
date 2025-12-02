import { AuthenticateCourierUseCase } from "@/domain/carrier/application/use-cases/authenticate-courier"
import { WrongCredentialsError } from "@/domain/carrier/application/use-cases/errors/wrong-credentials-error"
import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common"
import { z } from "zod"

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
@Public()
export class AuthenticateController {
  constructor(private authenticateCourier: AuthenticateCourierUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateCourier.execute({ cpf, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
