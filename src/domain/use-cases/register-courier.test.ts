import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { RegisterCourierUseCase } from "./register-courier"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: RegisterCourierUseCase

describe("Create Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new RegisterCourierUseCase(inMemoryCouriersRepository)
  })

  it("sliuld be able register a courier", async () => {
    const result = await sut.execute({
      name: "example",
      cpf: "123;456;789-00",
      email: "example@example.com",
    })

    expect(result.courier.name).toEqual("example")
  })
})
