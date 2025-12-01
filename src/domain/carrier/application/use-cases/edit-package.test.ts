import { makePackage } from "test/factories/make-package"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { PackageStatus } from "../../enterprise/entities/package"
import { EditPackageUseCase } from "./edit-package"

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditPackageUseCase

describe("Edit Package", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryRecipientsRepository
    )
    sut = new EditPackageUseCase(inMemoryPackagesRepository)
  })

  it("should be able to edit a package", async () => {
    const pkg = makePackage({})

    inMemoryPackagesRepository.items.push(pkg)

    await sut.execute({
      packageId: pkg.id.toString(),
      data: {
        description: "new description",
        status: PackageStatus.PICKED_UP,
      },
    })

    expect(inMemoryPackagesRepository.items[0]).toMatchObject({
      description: "new description",
      status: "PICKED_UP",
    })
  })
})
