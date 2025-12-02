import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { Package, PackageStatus } from "../../enterprise/entities/package"
import { PackagesRepository } from "../repositories/packages-repository"

interface EditPackageStatusUseCaseRequest {
  packageId: string
  status: PackageStatus
}

type EditPackageStatusUseCaseResponse = Either<
  ResourceNotFoundError,
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
  }: EditPackageStatusUseCaseRequest): Promise<EditPackageStatusUseCaseResponse> {
    const pkg = await this.packagesRepository.findById(packageId)
    if (!pkg) return left(new ResourceNotFoundError())

    pkg.status = status

    await this.packagesRepository.save(pkg)

    return right({ pkg })
  }
}
