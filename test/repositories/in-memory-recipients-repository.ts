import {
  FindManyNearbyCourierParams,
  RecipientsRepository,
} from "@/domain/carrier/application/repositories/recipients-repository"
import { getDistanceBetweenCoordinates } from "@/domain/carrier/application/utils/get-distance-between-coordinates"
import { Recipient } from "@/domain/carrier/enterprise/entities/recipient"
import { InMemoryCouriersRepository } from "./in-memory-couriers-repository"
import { InMemoryPackagesRepository } from "./in-memory-packages-repository"

export class InMemoryRecipientsRepository implements RecipientsRepository {
  constructor(
    private couriersRepository: InMemoryCouriersRepository,
    private packagesRepository: InMemoryPackagesRepository
  ) {}
  public items: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
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

  async findManyRecipientsNearbyCourier(
    courierId: string,
    params: FindManyNearbyCourierParams
  ): Promise<Recipient[]> {
    const courier = this.couriersRepository.items.find(
      (courier) => courier.id.toString() === courierId
    )

    if (!courier) {
      throw new Error(`Courier with ID "${courierId}" does not exist.`)
    }

    const courierPackages = this.packagesRepository.items.filter((pkg) =>
      pkg.courierId?.equals(courier.id)
    )

    const recipientsOfCourier = courierPackages
      .map((pkg) =>
        this.items.find((recipient) => recipient.id.equals(pkg.recipientId))
      )
      .filter(Boolean) as Recipient[]

    return recipientsOfCourier.filter((recipient) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: recipient.latitude, longitude: recipient.longitude }
      )

      const maxDistanceKm = 50 //50Km

      return distance <= maxDistanceKm
    })
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
