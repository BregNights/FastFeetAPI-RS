import { waitFor } from "@/domain/carrier/application/utils/wait-for"
import { PackageStatus } from "@/domain/carrier/enterprise/entities/package"
import { makeCourier } from "test/factories/make-courier"
import { makePackage } from "test/factories/make-package"
import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { MockInstance } from "vitest"
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification"
import { OnStatusChanged } from "./on-status-changed"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>

describe("On Status Changed", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryCouriersRepository,
      inMemoryPackagesRepository
    )
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryCouriersRepository,
      inMemoryRecipientsRepository
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    new OnStatusChanged(inMemoryPackagesRepository, sendNotificationUseCase)
  })

  it("should send a notification when On Status Changed", async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.create(courier)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const pkg = makePackage({
      courierId: courier.id,
      recipientId: recipient.id,
    })
    inMemoryPackagesRepository.create(pkg)

    pkg.status = PackageStatus.PICKED_UP

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
