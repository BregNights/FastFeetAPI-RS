import { EditRecipientUseCase } from "@/domain/carrier/application/use-cases/edit-recipient"
import { Role } from "@/domain/carrier/enterprise/entities/courier"

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

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  latitude: z
    .number()
    .refine((value) => {
      return Math.abs(value) <= 90
    })
    .optional(),
  longitude: z
    .number()
    .refine((value) => {
      return Math.abs(value) <= 180
    })
    .optional(),
})

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

@Controller("/recipients/:recipientId")
@Roles(Role.ADMIN)
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param("recipientId") recipientId: string
  ) {
    const { name, phone, email, address, latitude, longitude } = body

    const result = await this.editRecipient.execute({
      recipientId,
      data: { name, phone, email, address, latitude, longitude },
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }
  }
}
