import { EditPackageStatusUseCase } from "@/domain/carrier/application/use-cases/edit-package-status"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { PackageStatus } from "@/domain/carrier/enterprise/entities/package"
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
  Put,
} from "@nestjs/common"
import { z } from "zod"

const editPackageStatusBodySchema = z.object({
  status: z.enum(PackageStatus),
  description: z.string().optional(),
  courierId: z.string(),
})

type EditPackageStatusBodySchema = z.infer<typeof editPackageStatusBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editPackageStatusBodySchema)

@Controller("/packages/:packageId/status")
@Roles(Role.COURIER)
export class EditPackageStatusController {
  constructor(private editPackageStatus: EditPackageStatusUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditPackageStatusBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("packageId") packageId: string
  ) {
    const { status } = body
    const courierId = user.sub

    const result = await this.editPackageStatus.execute({
      packageId,
      courierId,
      status,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
