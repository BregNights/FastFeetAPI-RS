import { randomUUID } from "node:crypto"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { RegisterPackageUseCase } from "./register-package"

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: RegisterPackageUseCase

describe("Create Package", () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new RegisterPackageUseCase(inMemoryPackagesRepository)
  })

  it("slould be able register a package", async () => {
    const result = await sut.execute({
      courierId: "1",
      description: "Package",
      recipientId: "2",
      trackingCode: randomUUID(),
    })

    expect(result.pkg).toBeTruthy()
  })
})
