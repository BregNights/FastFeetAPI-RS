import { RegisterPackageUseCase } from "@/domain/carrier/application/use-cases/register-package"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import type { UserPayload } from "@/infra/auth/jwt.strategy"
import { Roles } from "@/infra/auth/role"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common"
import { z } from "zod"

const registerPackageBodySchema = z.object({
  description: z.string(),
})

type RegisterPackageBodySchema = z.infer<typeof registerPackageBodySchema>

const bodyValidationPipe = new ZodValidationPipe(registerPackageBodySchema)

@Controller("/packages/:recipientId")
@Roles(Role.ADMIN)
export class RegisterPackageController {
  constructor(private registerPackage: RegisterPackageUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: RegisterPackageBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("recipientId") recipientId: string
  ) {
    const { description } = body

    const courierId = user.sub

    const result = await this.registerPackage.execute({
      courierId,
      description,
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
