import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"
import { PackagesRepository } from "@/domain/carrier/application/repositories/packages-repository"
import { PackageStatusEvent } from "@/domain/carrier/enterprise/events/package-status-event"
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification"

export class OnStatusChanged implements EventHandler {
  constructor(
    private packagesRepository: PackagesRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendStatusChangedNotification.bind(this),
      PackageStatusEvent.name
    )
  }

  private async sendStatusChangedNotification({ pkg }: PackageStatusEvent) {
    const result = await this.packagesRepository.findDetailsById(
      pkg.id.toString()
    )

    if (result) {
      await this.sendNotification.execute({
        recipientId: result.recipientId.toString(),
        title: `Notificação da sua encomenda.`,
        content: `Seu pacote agora está: ${result.status}`,
      })
    }
  }
}
