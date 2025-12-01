import { Recipient } from "../../enterprise/entities/recipient"

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface RecipientsRepository {
  create(recipient: Recipient): Promise<void>
  findById(id: string): Promise<Recipient | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Recipient[]>
  save(recipient: Recipient): Promise<void>
}
