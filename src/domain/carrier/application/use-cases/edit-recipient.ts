import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Recipient, RecipientProps } from "../../enterprise/entities/recipient"
import { RecipientsRepository } from "../repositories/recipients-repository"

interface EditRecipientUseCaseRequest {
  recipientId: string
  data: Partial<
    Pick<
      RecipientProps,
      "name" | "phone" | "email" | "address" | "latitude" | "longitude"
    >
  >
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    data,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) return left(new ResourceNotFoundError())

    recipient.update(data)

    await this.recipientsRepository.save(recipient)

    return right({ recipient })
  }
}
