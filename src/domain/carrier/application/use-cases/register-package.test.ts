import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { RegisterPackageUseCase } from "./register-package"

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository

let sut: RegisterPackageUseCase

describe("Create Package", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository
    )
    sut = new RegisterPackageUseCase(inMemoryPackagesRepository)
  })

  it("should be able register a package", async () => {
    const result = await sut.execute({
      description: "Package",
      recipientId: "2",
    })

    expect(result.isRight()).toBe(true)
  })
})
