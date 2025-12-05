import { EditCourierPasswordUseCase } from "@/domain/carrier/application/use-cases/edit-courier-password"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { Roles } from "@/infra/auth/role"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common"
import { z } from "zod"

const editCourierPasswordBodySchema = z.object({
  password: z.string(),
})

type EditCourierPasswordBodySchema = z.infer<
  typeof editCourierPasswordBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(editCourierPasswordBodySchema)

@Controller("/couriers/:courierId/password")
@Roles(Role.ADMIN)
export class EditCourierPasswordController {
  constructor(private editCourierPassword: EditCourierPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCourierPasswordBodySchema,
    @Param("courierId") courierId: string
  ) {
    const { password } = body

    const result = await this.editCourierPassword.execute({
      courierId,
      password,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
