import { DomainEvents } from "@/core/events/domain-events"
import { PackagesRepository } from "@/domain/carrier/application/repositories/packages-repository"
import { Package } from "@/domain/carrier/enterprise/entities/package"
import { PackageDetails } from "@/domain/carrier/enterprise/entities/value-objects/package-details"
import { InMemoryRecipientsRepository } from "./in-memory-recipients-repository"

export class InMemoryPackagesRepository implements PackagesRepository {
  constructor(private recipientsRepository: InMemoryRecipientsRepository) {}

  public items: Package[] = []

  async create(pkg: Package): Promise<void> {
    this.items.push(pkg)

    DomainEvents.dispatchEventsForAggregate(pkg.id)
  }

  async findById(id: string): Promise<Package | null> {
    const pkg = this.items.find((item) => item.id.toString() === id)

    return pkg || null
  }

  async findDetailsById(id: string): Promise<PackageDetails | null> {
    const pkg = this.items.find((item) => item.id.toString() === id)

    if (!pkg) return null

    const recipient = this.recipientsRepository.items.find((recipient) => {
      return recipient.id.equals(pkg?.recipientId)
    })

    if (!recipient) {
      throw new Error(
        `recipient with ID "${pkg.recipientId.toString()}" does not exist.`
      )
    }

    return PackageDetails.create({
      packageId: pkg.id,
      trackingCode: pkg.trackingCode,
      description: pkg.description,
      status: pkg.status,

      recipientId: recipient.id,
      recipientAddress: recipient.address,
      recipientName: recipient.name,
      recipientPhone: recipient.phone,

      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    })
  }

  async findManyPackages(page: number): Promise<Package[]> {
    const pkg = this.items.slice((page - 1) * 20, page * 20)

    return pkg
  }

  async save(pkg: Package): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === pkg.id)

    this.items[itemIndex] = pkg

    DomainEvents.dispatchEventsForAggregate(pkg.id)
  }
}
