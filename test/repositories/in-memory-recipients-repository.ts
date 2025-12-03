import {
  FindManyNearbyParams,
  RecipientsRepository,
} from "@/domain/carrier/application/repositories/recipients-repository"
import { getDistanceBetweenCoordinates } from "@/domain/carrier/application/utils/get-distance-between-coordinates"
import { Recipient } from "@/domain/carrier/enterprise/entities/recipient"

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        }
      )

      const MAX_DISTANCE_RECIPIENTS_IN_KILOMITERS = 10 //10KM

      return distance < MAX_DISTANCE_RECIPIENTS_IN_KILOMITERS
    })
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    return recipient || null
  }

  async findByCPF(cpf: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === cpf)

    return recipient || null
  }

  async findManyRecipients(page: number): Promise<Recipient[]> {
    const recipient = this.items.slice((page - 1) * 20, page * 20)

    return recipient
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items.splice(itemIndex, 1)
  }
}
