import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Package } from "../entities/package"
import { PackageRepository } from "../repositories/packages-repository"

interface RegisterPackageUseCaseRequest {
  trackingCode: string
  description: string
  recipientId: string
  courierId: string
}

export class RegisterPackageUseCase {
  constructor(private packageRepository: PackageRepository) {}

  async execute({
    trackingCode,
    description,
    recipientId,
    courierId,
  }: RegisterPackageUseCaseRequest) {
    const pkg = await Package.create({
      trackingCode,
      description,
      recipientId: new UniqueEntityID(recipientId),
      courierId: new UniqueEntityID(courierId),
    })

    await this.packageRepository.create(pkg)

    return pkg
  }
}
