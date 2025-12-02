import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { PackageDetailsProps } from "../../enterprise/entities/value-objects/package-details"
import { PackagesRepository } from "../repositories/packages-repository"

interface GetPackageByIdUseCaseRequest {
  packageId: string
}

type GetPackageByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    pkg: PackageDetailsProps
  }
>

@Injectable()
export class GetPackageByIdUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    packageId,
  }: GetPackageByIdUseCaseRequest): Promise<GetPackageByIdUseCaseResponse> {
    const pkg = await this.packagesRepository.findDetailsById(packageId)

    if (!pkg) {
      return left(new ResourceNotFoundError())
    }

    return right({ pkg })
  }
}
