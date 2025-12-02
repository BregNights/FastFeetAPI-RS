import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { Courier, CourierProps } from "../../enterprise/entities/courier"
import { HashGenerator } from "../cryptography/hash-generator"
import { CouriersRepository } from "../repositories/couriers-repository"

interface EditCourierUseCaseRequest {
  courierId: string
  data: Partial<Pick<CourierProps, "name" | "email" | "password">>
}

type EditCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courier: Courier
  }
>

@Injectable()
export class EditCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    courierId,
    data,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) return left(new ResourceNotFoundError())

    if (data.name) courier.name = data.name
    if (data.email) courier.email = data.email
    if (data.password) {
      const hashedPassword = await this.hashGenerator.hash(data.password)

      courier.password = hashedPassword
    }

    await this.couriersRepository.save(courier)

    return right({ courier })
  }
}
