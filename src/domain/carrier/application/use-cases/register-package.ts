import { Either, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"
import { Package } from "../../enterprise/entities/package"
import { PackagesRepository } from "../repositories/packages-repository"

interface RegisterPackageUseCaseRequest {
  trackingCode: string
  description: string
  recipientId: string
  courierId: string
}

type RegisterPackageUseCaseResponse = Either<
  null,
  {
    pkg: Package
  }
>

@Injectable()
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

    return right({ pkg })
  }
}
