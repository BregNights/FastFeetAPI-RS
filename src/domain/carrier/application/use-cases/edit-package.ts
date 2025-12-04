import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { Package, PackageProps } from "../../enterprise/entities/package"
import { PackagesRepository } from "../repositories/packages-repository"

interface EditPackageUseCaseRequest {
  packageId: string
  data: Partial<Pick<PackageProps, "description" | "status" | "courierId">>
}

type EditPackageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    pkg: Package
  }
>

@Injectable()
export class EditPackageUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    packageId,
    data,
  }: EditPackageUseCaseRequest): Promise<EditPackageUseCaseResponse> {
    const pkg = await this.packagesRepository.findById(packageId)
    if (!pkg) return left(new ResourceNotFoundError())

    if (data.description) pkg.description = data.description
    if (data.status) pkg.status = data.status
    if (data.courierId) pkg.courierId = data.courierId

    await this.packagesRepository.save(pkg)

    return right({ pkg })
  }
}
