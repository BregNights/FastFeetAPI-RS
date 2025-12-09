import { makeCourier } from "test/factories/make-courier"
import { makePackage } from "test/factories/make-package"
import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { PackageStatus } from "../../enterprise/entities/package"
import { FetchNearbyRecipientsUseCase } from "./fetch-nearby-recipients"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: FetchNearbyRecipientsUseCase

describe("Fetch Nearby Recipients Use Case", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryCouriersRepository,
      inMemoryRecipientsRepository
    )
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryCouriersRepository,
      inMemoryPackagesRepository
    )

    sut = new FetchNearbyRecipientsUseCase(inMemoryRecipientsRepository)
  })

  it("should be able to fetch nearby recipients by courier", async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const recipientNear1 = makeRecipient({
      name: "1km Recipient",
      latitude: -26.9116251,
      longitude: -49.0712552,
    })
    inMemoryRecipientsRepository.items.push(recipientNear1)

    const pkg1 = makePackage({
      courierId: courier.id,
      status: PackageStatus.PICKED_UP,
      recipientId: recipientNear1.id,
    })
    inMemoryPackagesRepository.items.push(pkg1)

    const recipientNear2 = makeRecipient({
      name: "2km Recipient",
      latitude: -26.908467,
      longitude: -49.072644,
    })
    inMemoryRecipientsRepository.items.push(recipientNear2)

    const pkg2 = makePackage({
      courierId: courier.id,
      status: PackageStatus.PICKED_UP,
      recipientId: recipientNear2.id,
    })
    inMemoryPackagesRepository.items.push(pkg2)

    const recipientFar = makeRecipient({
      name: "60km Recipient",
      latitude: -27.498461,
      longitude: -48.650304,
    })
    inMemoryRecipientsRepository.items.push(recipientFar)

    const pkg3 = makePackage({
      courierId: courier.id,
      status: PackageStatus.PICKED_UP,
      recipientId: recipientFar.id,
    })
    inMemoryPackagesRepository.items.push(pkg3)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      courierLatitude: -26.91216,
      courierLongitude: -49.070019,
    })

    expect(result.value?.recipients).toHaveLength(2)
    expect(result.value?.recipients).toEqual([
      expect.objectContaining({ name: "1km Recipient" }),
      expect.objectContaining({ name: "2km Recipient" }),
    ])
  })

  it("should not be able to fetch nearby recipients from another courier", async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const anotherCourier = makeCourier()
    inMemoryCouriersRepository.items.push(anotherCourier)

    const recipientNear1 = makeRecipient({
      name: "Near Recipient1",
      latitude: -26.9036674,
      longitude: -49.0844627,
    })
    inMemoryRecipientsRepository.items.push(recipientNear1)

    const pkg1 = makePackage({
      courierId: anotherCourier.id,
      status: PackageStatus.PICKED_UP,
      recipientId: recipientNear1.id,
    })
    inMemoryPackagesRepository.items.push(pkg1)

    const recipientNear2 = makeRecipient({
      name: "Near Recipient2",
      latitude: -26.9036674,
      longitude: -49.0844627,
    })
    inMemoryRecipientsRepository.items.push(recipientNear2)

    const pkg2 = makePackage({
      courierId: anotherCourier.id,
      status: PackageStatus.PICKED_UP,
      recipientId: recipientNear2.id,
    })
    inMemoryPackagesRepository.items.push(pkg2)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      courierLatitude: -26.9036674,
      courierLongitude: -49.0844627,
    })

    expect(result.value?.recipients).toHaveLength(0)
  })
})
