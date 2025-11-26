import { Recipient } from "@/domain/entities/recipient"
import { RecipientsRepository } from "@/domain/repositories/recipients-repository"

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }
}
