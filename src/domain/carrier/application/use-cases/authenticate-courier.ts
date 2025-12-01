import { Either, left, right } from "@/core/either"
import { Encrypter } from "../cryptography/encrypter"
import { HashComparer } from "../cryptography/hash-comparer"
import { CouriersRepository } from "../repositories/couriers-repository"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"

type AuthenticateCourierUseCaseRequest = {
  cpf: string
  password: string
}

type AuthenticateCourierUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByCPF(cpf)

    if (!courier) return left(new WrongCredentialsError())

    const isPasswordValid = await this.hashComparer.compare(
      password,
      courier.password
    )

    if (!isPasswordValid) return left(new WrongCredentialsError())

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
      role: "COURIER",
    })

    return right({ accessToken })
  }
}
