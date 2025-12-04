import { Either, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"
import { Package } from "../../enterprise/entities/package"
import { PackagesRepository } from "../repositories/packages-repository"

interface RegisterPackageUseCaseRequest {
  description: string
  recipientId: string
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
    description,
    recipientId,
  }: RegisterPackageUseCaseRequest): Promise<RegisterPackageUseCaseResponse> {
    const pkg = Package.create({
      description,
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.packagesRepository.create(pkg)

    return right({ pkg })
  }
}
