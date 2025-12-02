import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientsRepository } from "../repositories/recipients-repository"

interface FetchNearbyRecipientsUseCaseRequest {
  courierLatitude: number
  courierLongitude: number
}

type FetchNearbyRecipientsUseCaseResponse = Either<
  null,
  {
    recipients: Recipient[]
  }
>

@Injectable()
export class FetchNearbyRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    courierLatitude,
    courierLongitude,
  }: FetchNearbyRecipientsUseCaseRequest): Promise<FetchNearbyRecipientsUseCaseResponse> {
    const recipients = await this.recipientsRepository.findManyNearby({
      latitude: courierLatitude,
      longitude: courierLongitude,
    })

    return right({ recipients })
  }
}
