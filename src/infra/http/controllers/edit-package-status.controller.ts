import { EditPackageStatusUseCase } from "@/domain/carrier/application/use-cases/edit-package-status"
import { PackageStatus } from "@/domain/carrier/enterprise/entities/package"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import type { UserPayload } from "@/infra/auth/jwt.strategy"
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

const editPackageStatusBodySchema = z.object({
  status: z.enum(PackageStatus),
})

type EditPackageStatusBodySchema = z.infer<typeof editPackageStatusBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editPackageStatusBodySchema)

@Controller("/packages/:packageId/status")
// @Roles(Role.COURIER)
export class EditPackageStatusController {
  constructor(private editPackageStatus: EditPackageStatusUseCase) {}

  @Patch()
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
