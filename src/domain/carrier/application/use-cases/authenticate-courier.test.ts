import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeCourier } from "test/factories/make-courier"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { AuthenticateCourierUseCase } from "./authenticate-courier"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateCourierUseCase

describe("Authenticate Courier Use Case", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateCourierUseCase(
      inMemoryCouriersRepository,
      fakeHasher,
      fakeEncrypter
    )
  })

  it("should be able to authenticate a courier with cpf", async () => {
    const courier = makeCourier({
      cpf: "123.456.789-80",
      password: await fakeHasher.hash("123456"),
    })

    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      cpf: courier.cpf,
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
