import { makeCourier } from "test/factories/make-courier"
import { makePackage } from "test/factories/make-package"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { PackageStatus } from "../../enterprise/entities/package"
import { EditPackageStatusUseCase } from "./edit-package-status"
import { DeliveredWithoutPickedup } from "./errors/delivered-without-pickedup-error"
import { NotThePickupCourierError } from "./errors/not-pickup-courier-error"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditPackageStatusUseCase

describe("Update status package", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository
    )
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new EditPackageStatusUseCase(
      inMemoryPackagesRepository,
      inMemoryCouriersRepository
    )
  })

  it("should be able to update the package status.", async () => {
    const pkg = makePackage()
    inMemoryPackagesRepository.items.push(pkg)

    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    await sut.execute({
      packageId: pkg.id.toString(),
      courierId: courier.id.toString(),
      status: PackageStatus.PICKED_UP,
    })

    expect(pkg.status).toEqual("PICKED_UP")
    expect(pkg.courierId).toEqual(courier.id)
  })

  it("should not be able to update the package status without first setting it to picked up.", async () => {
    const pkg = makePackage()
    inMemoryPackagesRepository.items.push(pkg)

    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      packageId: pkg.id.toString(),
      courierId: courier.id.toString(),
      status: PackageStatus.DELIVERED,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveredWithoutPickedup)
  })

  it("should not be able to update the package to be delivered by another courier", async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const pkg = makePackage({
      courierId: courier.id,
      status: PackageStatus.PICKED_UP,
    })
    inMemoryPackagesRepository.items.push(pkg)

    const anotherCourier = makeCourier()
    inMemoryCouriersRepository.items.push(anotherCourier)

    const result = await sut.execute({
      packageId: pkg.id.toString(),
      courierId: anotherCourier.id.toString(),
      status: PackageStatus.DELIVERED,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotThePickupCourierError)
  })
})
