import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Recipient } from "../entities/recipient"
import { RecipientsRepository } from "../repositories/recipients-repository"

interface RegisterRecipientUseCaseRequest {
  name: string
  cpf: string
  phone: string
  email: string
  address: string
  latitude: number
  longitude: number
  packageId: string
  courierId: string
}

interface RegisterRecipientUseCaseResponse {
  recipient: Recipient
}

export class RegisterRecipientUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    name,
    cpf,
    phone,
    email,
    address,
    latitude,
    longitude,
    packageId,
    courierId,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
      cpf,
      phone,
      email,
      address,
      latitude,
      longitude,
      packageId: new UniqueEntityID(packageId),
      courierId: new UniqueEntityID(courierId),
    })

    await this.recipientRepository.create(recipient)

    return { recipient }
  }
}
