import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientsRepository } from "../repositories/recipients-repository"
import { RecipientAlreadyExistsError } from "./errors/recipient-already-exists-error"

interface RegisterRecipientUseCaseRequest {
  name: string
  cpf: string
  phone: string
  email: string
  address: string
  latitude: number
  longitude: number
}

type RegisterRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
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
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipientExists = await this.recipientRepository.findByCPF(cpf)
    if (recipientExists) return left(new RecipientAlreadyExistsError(cpf))

    const recipient = Recipient.create({
      name,
      cpf,
      phone,
      email,
      address,
      latitude,
      longitude,
    })

    await this.recipientRepository.create(recipient)

    return right({ recipient })
  }
}
