import { Either, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Package } from "../entities/package"

interface ExpeditionPackageUseCaseRequest {
  trackingCode: string
  description: string
  recipientId: string
  courierId: string
}

type ExpeditionPackageUseCaseResponse = Either<
  null,
  {
    pkg: Package
  }
>

export class ExpeditionPackageUseCase {
  constructor(private expeditionsRepository: ExpeditionsRepository) {}

  async execute({
    trackingCode,
    description,
    recipientId,
    courierId,
  }: ExpeditionPackageUseCaseRequest): Promise<ExpeditionPackageUseCaseResponse> {
    const expedition = Package.create({
      trackingCode,
      description,
      recipientId: new UniqueEntityID(recipientId),
      courierId: new UniqueEntityID(courierId),
    })

    await this.expeditionsRepository.create(expedition)

    return right({ expedition })
  }
}
