import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Courier } from "../../enterprise/entities/courier"
import { HashGenerator } from "../cryptography/hash-generator"
import { CouriersRepository } from "../repositories/couriers-repository"

interface EditCourierUseCaseRequest {
  courierId: string
  password: string
}

type EditCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courier: Courier
  }
>

export class EditCourierPasswordUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    courierId,
    password,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) return left(new ResourceNotFoundError())

    const hashedPassword = await this.hashGenerator.hash(password)

    courier.password = hashedPassword

    await this.couriersRepository.save(courier)

    return right({ courier })
  }
}
