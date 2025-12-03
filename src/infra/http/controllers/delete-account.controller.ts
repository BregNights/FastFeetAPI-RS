import { DeleteCourierUseCase } from "@/domain/carrier/application/use-cases/delete-courier"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { Roles } from "@/infra/auth/role"
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common"

@Controller("/accounts/:id")
@Roles(Role.ADMIN)
export class DeleteAccountController {
  constructor(private deleteCourier: DeleteCourierUseCase) {}
  @Delete()
  @HttpCode(204)
  async handle(@Param("id") courierId: string) {
    const result = await this.deleteCourier.execute({
      courierId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
