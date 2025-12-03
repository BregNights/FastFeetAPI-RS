import { makeCourier } from "test/factories/make-courier"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { DeleteCourierUseCase } from "./delete-courier"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: DeleteCourierUseCase

describe("Delete Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new DeleteCourierUseCase(inMemoryCouriersRepository)
  })

  it("should be able to delete a courier", async () => {
    const courier = makeCourier({})

    inMemoryCouriersRepository.items.push(courier)

    await sut.execute({
      courierId: courier.id.toString(),
    })

    expect(inMemoryCouriersRepository.items).toHaveLength(0)
  })
})
