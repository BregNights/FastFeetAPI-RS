import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Package } from "../entities/package"
import { PackagesRepository } from "../repositories/packages-repository"

interface RegisterPackageUseCaseRequest {
  trackingCode: string
  description: string
  recipientId: string
  courierId: string
}

interface RegisterPackageUseCaseResponse {
  pkg: Package
}

export class RegisterPackageUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    trackingCode,
    description,
    recipientId,
    courierId,
  }: RegisterPackageUseCaseRequest): Promise<RegisterPackageUseCaseResponse> {
    const pkg = Package.create({
      trackingCode,
      description,
      recipientId: new UniqueEntityID(recipientId),
      courierId: new UniqueEntityID(courierId),
    })

    await this.packagesRepository.create(pkg)

    return { pkg }
  }
}
