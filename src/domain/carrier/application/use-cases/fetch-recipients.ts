import { Either, right } from "@/core/either"
import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientsRepository } from "../repositories/recipients-repository"

interface FetchRecipientUseCaseRequest {
  page: number
}

type FetchRecipientUseCaseResponse = Either<
  null,
  {
    recipient: Recipient[]
  }
>

export class FetchRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
  }: FetchRecipientUseCaseRequest): Promise<FetchRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findManyRecipients(page)

    return right({ recipient })
  }
}
