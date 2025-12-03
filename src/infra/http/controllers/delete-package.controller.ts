import { DeletePackageUseCase } from "@/domain/carrier/application/use-cases/delete-package"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { Roles } from "@/infra/auth/role"
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common"

@Controller("/packages/:id")
@Roles(Role.ADMIN)
export class DeletePackageController {
  constructor(private deletePackage: DeletePackageUseCase) {}
  @Delete()
  @HttpCode(204)
  async handle(@Param("id") packageId: string) {
    const result = await this.deletePackage.execute({
      packageId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
