import { FetchCouriersUseCase } from "@/domain/carrier/application/use-cases/fetch-couriers"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { Roles } from "@/infra/auth/role"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { BadRequestException, Controller, Get, Query } from "@nestjs/common"
import { z } from "zod"
import { CourierPresenter } from "../presenters/courier-presenter"

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/couriers")
@Roles(Role.ADMIN)
export class FetchCouriersController {
  constructor(private fetchCouriers: FetchCouriersUseCase) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchCouriers.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const couriers = result.value.couriers

    return { couriers: couriers.map(CourierPresenter.toHTTP) }
  }
}
