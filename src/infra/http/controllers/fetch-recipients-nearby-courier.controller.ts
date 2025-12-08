import { FetchNearbyRecipientsUseCase } from "@/domain/carrier/application/use-cases/fetch-nearby-recipients"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import type { UserPayload } from "@/infra/auth/jwt.strategy"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { BadRequestException, Body, Controller, Get } from "@nestjs/common"
import { z } from "zod"
import { RecipientPresenter } from "../presenters/recipient-presenter"

const nearbyRecipientsBodySchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

type NearbyRecipientsBodySchema = z.infer<typeof nearbyRecipientsBodySchema>

const bodyValidationPipe = new ZodValidationPipe(nearbyRecipientsBodySchema)

@Controller("/recipients/nearby")
export class FetchRecipientsNearbyCourierController {
  constructor(
    private fetchRecipientsNearbyCourier: FetchNearbyRecipientsUseCase
  ) {}

  @Get()
  async handle(
    @Body(bodyValidationPipe) body: NearbyRecipientsBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { latitude, longitude } = body

    const result = await this.fetchRecipientsNearbyCourier.execute({
      courierId: user.sub,
      courierLatitude: latitude,
      courierLongitude: longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const recipients = result.value.recipients

    return { recipients: recipients.map(RecipientPresenter.toHTTP) }
  }
}
