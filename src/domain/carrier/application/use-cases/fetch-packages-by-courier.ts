import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { Injectable } from "@nestjs/common"
import { Role } from "../../enterprise/entities/courier"
import { Package } from "../../enterprise/entities/package"
import { PackagesRepository } from "../repositories/packages-repository"

interface FetchPackageUseCaseRequest {
  courierId: string
  page: number
  requesterId: string
  requesterRole: string
}

type FetchPackageUseCaseResponse = Either<
  NotAllowedError,
  {
    pkgs: Package[]
  }
>

@Injectable()
export class FetchPackagesByCourierUseCase {
  constructor(private packagesbycourierRepository: PackagesRepository) {}

  async execute({
    courierId,
    page,
    requesterId,
    requesterRole,
  }: FetchPackageUseCaseRequest): Promise<FetchPackageUseCaseResponse> {
    if (requesterRole !== Role.ADMIN && requesterId !== courierId) {
      return left(new NotAllowedError())
    }

    const pkgs =
      await this.packagesbycourierRepository.findManyPackagesByCourierId(
        courierId,
        page
      )

    return right({ pkgs })
  }
}
