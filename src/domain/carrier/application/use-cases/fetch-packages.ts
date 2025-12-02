import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Package } from "../../enterprise/entities/package"
import { PackagesRepository } from "../repositories/packages-repository"

interface FetchPackageUseCaseRequest {
  page: number
}

type FetchPackageUseCaseResponse = Either<
  null,
  {
    pkg: Package[]
  }
>

@Injectable()
export class FetchPackagesUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    page,
  }: FetchPackageUseCaseRequest): Promise<FetchPackageUseCaseResponse> {
    const pkg = await this.packagesRepository.findManyPackages(page)

    return right({ pkg })
  }
}
