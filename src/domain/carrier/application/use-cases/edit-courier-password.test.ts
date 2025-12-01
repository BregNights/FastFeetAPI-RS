import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeCourier } from "test/factories/make-courier"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { EditCourierPasswordUseCase } from "./edit-courier-password"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let sut: EditCourierPasswordUseCase

describe("edit courier password", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    sut = new EditCourierPasswordUseCase(inMemoryCouriersRepository, fakeHasher)
  })

  it("should be able to edit a password from courier.", async () => {
    const courier = makeCourier({ password: "123456" })

    inMemoryCouriersRepository.items.push(courier)

    await sut.execute({
      courierId: courier.id.toString(),
      password: "654321",
    })

    const fakeHashedPassword = await fakeHasher.hash("654321")

    expect(inMemoryCouriersRepository.items[0]).toMatchObject({
      password: fakeHashedPassword,
    })
  })
})
