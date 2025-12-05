import { makePackage } from "test/factories/make-package"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { DeletePackageUseCase } from "./delete-package"

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeletePackageUseCase

describe("Delete Package", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository
    )
    sut = new DeletePackageUseCase(inMemoryPackagesRepository)
  })

  it("should be able to delete a package", async () => {
    const pkg = makePackage({})

    inMemoryPackagesRepository.items.push(pkg)

    await sut.execute({
      packageId: pkg.id.toString(),
    })

    expect(inMemoryPackagesRepository.items).toHaveLength(0)
  })
})
