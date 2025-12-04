import { RegisterPackageUseCase } from "@/domain/carrier/application/use-cases/register-package"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
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
import { PackagePresenter } from "../presenters/package-presenter"

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
    @Param("recipientId") recipientId: string
  ) {
    const { description } = body

    const result = await this.registerPackage.execute({
      description,
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { package: PackagePresenter.toHTTP(result.value.pkg) }
  }
}
