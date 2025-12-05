import { DomainEvents } from "@/core/events/domain-events"
import { PackagesRepository } from "@/domain/carrier/application/repositories/packages-repository"
import { Package } from "@/domain/carrier/enterprise/entities/package"
import { PackageDetails } from "@/domain/carrier/enterprise/entities/value-objects/package-details"
import { InMemoryCouriersRepository } from "./in-memory-couriers-repository"
import { InMemoryRecipientsRepository } from "./in-memory-recipients-repository"

export class InMemoryPackagesRepository implements PackagesRepository {
  constructor(
    private recipientsRepository: InMemoryRecipientsRepository,
    private couriersRepository: InMemoryCouriersRepository
  ) {}

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

  async findManyPackages(packageId: string, page: number): Promise<Package[]> {
    const pkgs = this.items
      .filter((item) => item.id.toString() === packageId)
      .slice((page - 1) * 20, page * 20)

    return pkgs
  }

  async findManyPackagesByCourierId(
    courierId: string,
    page: number
  ): Promise<PackageDetails[]> {
    const pkgs = this.items
      .filter((item) => item.courierId?.toString() === courierId)
      .slice((page - 1) * 20, page * 20)
      .map((pkg) => {
        const recipient = this.recipientsRepository.items.find((recipient) =>
          recipient.id.equals(pkg.recipientId)
        )

        if (!recipient) {
          throw new Error(
            `Recipient with ID "${pkg.recipientId.toString()}" does not exist.`
          )
        }

        const courier = this.couriersRepository.items.find((courier) =>
          courier.id.equals(pkg.courierId!)
        )

        if (!courier) {
          throw new Error(
            `Courier with ID "${pkg.courierId?.toString()}" does not exist.`
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
      })

    return pkgs
  }

  async save(pkg: Package): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === pkg.id)

    this.items[itemIndex] = pkg

    DomainEvents.dispatchEventsForAggregate(pkg.id)
  }

  async delete(pkg: Package): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === pkg.id)

    this.items.splice(itemIndex, 1)
  }
}
