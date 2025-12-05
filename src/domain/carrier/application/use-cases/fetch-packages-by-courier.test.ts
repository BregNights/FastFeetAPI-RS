import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { makeCourier } from "test/factories/make-courier"
import { makePackage } from "test/factories/make-package"
import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { Role } from "../../enterprise/entities/courier"
import { PackageStatus } from "../../enterprise/entities/package"
import { FetchPackagesByCourierUseCase } from "./fetch-packages-by-courier"

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchPackagesByCourierUseCase

describe("Fetch Packages by Courier Use Case", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository
    )
    sut = new FetchPackagesByCourierUseCase(inMemoryPackagesRepository)
  })

  it("should be able to fetch packages by courier", async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    for (let i = 1; i <= 22; i++) {
      const recipient = makeRecipient()
      inMemoryRecipientsRepository.items.push(recipient)
      const pkg = makePackage({
        courierId: courier.id,
        recipientId: recipient.id,
        status: PackageStatus.PICKED_UP,
      })
      inMemoryPackagesRepository.items.push(pkg)
    }

    const result = await sut.execute({
      courierId: courier.id.toString(),
      page: 1,
      requesterId: courier.id.toString(),
      requesterRole: Role.COURIER,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.pkgs).toHaveLength(20)
    }
  })

  it("should be able to fetch paginated packages", async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    for (let i = 1; i <= 22; i++) {
      const recipient = makeRecipient()
      inMemoryRecipientsRepository.items.push(recipient)
      const pkg = makePackage({
        courierId: courier.id,
        recipientId: recipient.id,
        status: PackageStatus.PICKED_UP,
      })
      inMemoryPackagesRepository.items.push(pkg)
    }

    const result = await sut.execute({
      courierId: courier.id.toString(),
      page: 2,
      requesterId: courier.id.toString(),
      requesterRole: Role.ADMIN,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.pkgs).toHaveLength(2)
    }
  })

  it("should not be able to fetch paginated packages from another courier", async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const otherCourier = makeCourier()
    inMemoryCouriersRepository.items.push(otherCourier)

    for (let i = 1; i <= 22; i++) {
      const recipient = makeRecipient()
      inMemoryRecipientsRepository.items.push(recipient)
      const pkg = makePackage({
        courierId: courier.id,
        recipientId: recipient.id,
        status: PackageStatus.PICKED_UP,
      })
      inMemoryPackagesRepository.items.push(pkg)
    }

    const result = await sut.execute({
      courierId: courier.id.toString(),
      page: 1,
      requesterId: otherCourier.id.toString(),
      requesterRole: Role.COURIER,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
