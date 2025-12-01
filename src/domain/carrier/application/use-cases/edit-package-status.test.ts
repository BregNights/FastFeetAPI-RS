import { makePackage } from "test/factories/make-package"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { PackageStatus } from "../../enterprise/entities/package"
import { EditPackageStatusUseCase } from "./edit-package-status"

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditPackageStatusUseCase

describe("Update status package", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryRecipientsRepository
    )
    sut = new EditPackageStatusUseCase(inMemoryPackagesRepository)
  })

  it("should be able to update the package status.", async () => {
    const pkg = makePackage()

    inMemoryPackagesRepository.items.push(pkg)

    await sut.execute({
      packageId: pkg.id.toString(),
      status: PackageStatus.PICKED_UP,
    })

    expect(pkg.status).toEqual("PICKED_UP")
  })
})
