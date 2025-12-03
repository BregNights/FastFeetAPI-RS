import { Recipient } from "../../enterprise/entities/recipient"

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export abstract class RecipientsRepository {
  abstract create(recipient: Recipient): Promise<void>
  abstract findById(id: string): Promise<Recipient | null>
  abstract findByCPF(cpf: string): Promise<Recipient | null>
  abstract findManyNearby(params: FindManyNearbyParams): Promise<Recipient[]>
  abstract findManyRecipients(page: number): Promise<Recipient[]>
  abstract save(recipient: Recipient): Promise<void>
}
