import { Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { Package, PackageStatus } from "../../enterprise/entities/package"
import { PackagesRepository } from "../repositories/packages-repository"
import { CourierRequiredError } from "./errors/courier-required-error"
import { DeliveredWithoutPickedup } from "./errors/delivered-without-pickedup-error"

interface EditPackageStatusUseCaseRequest {
  packageId: string
  courierId: string
  status: PackageStatus
}

type EditPackageStatusUseCaseResponse = Either<
  ResourceNotFoundError | CourierRequiredError | DeliveredWithoutPickedup,
  {
    pkg: Package
  }
>

@Injectable()
export class EditPackageStatusUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    packageId,
    status,
    courierId,
  }: EditPackageStatusUseCaseRequest): Promise<EditPackageStatusUseCaseResponse> {
    const pkg = await this.packagesRepository.findById(packageId)
    if (!pkg) return left(new ResourceNotFoundError())

    if (
      status === PackageStatus.DELIVERED &&
      pkg.status !== PackageStatus.PICKED_UP
    ) {
      return left(new DeliveredWithoutPickedup())
    }

    if (status === PackageStatus.PICKED_UP && !courierId) {
      return left(new CourierRequiredError())
    }

    pkg.status = status
    pkg.courierId = new UniqueEntityID(courierId)

    await this.packagesRepository.save(pkg)

    return right({ pkg })
  }
}
