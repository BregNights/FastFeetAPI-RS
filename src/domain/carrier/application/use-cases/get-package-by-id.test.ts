import { makePackage } from "test/factories/make-package"
import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { GetPackageByIdUseCase } from "./get-package-by-id"

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: GetPackageByIdUseCase

describe("Get Package", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository
    )
    sut = new GetPackageByIdUseCase(inMemoryPackagesRepository)
  })

  it("should be able to get a package by id", async () => {
    const recipient = makeRecipient({})
    inMemoryRecipientsRepository.items.push(recipient)

    const pkg = makePackage({ recipientId: recipient.id })
    inMemoryPackagesRepository.items.push(pkg)

    const result = await sut.execute({
      packageId: pkg.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      pkg: expect.objectContaining({
        trackingCode: pkg.trackingCode,
        recipientName: recipient.name,
      }),
    })
  })
})
