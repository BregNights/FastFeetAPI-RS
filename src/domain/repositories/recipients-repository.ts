import { Recipient } from "../entities/recipient"

export interface RecipientsRepository {
  create(recipient: Recipient): Promise<void>
}
