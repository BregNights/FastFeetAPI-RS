import { Either, left, right } from "@/core/either"
import { Encrypter } from "../cryptography/encrypter"
import { HashComparer } from "../cryptography/hash-comparer"
import { CouriersRepository } from "../repositories/couriers-repository"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"

interface AuthenticateCourierUseCaseRequest {
  email: string
  //   cpf: string
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
    email,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByEmail(email)

    if (!courier) {
      return left(new WrongCredentialsError())
    }

    console.log(password, courier.password)

    const isPassworldValid = await this.hashComparer.compare(
      password,
      courier.password
    )

    if (!isPassworldValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
    })

    return right({ accessToken })
  }
}
