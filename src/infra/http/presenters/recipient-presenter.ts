import { Recipient } from "@/domain/carrier/enterprise/entities/recipient"

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
        name:recipient.name,
        phone:recipient.phone,
        email:recipient.email,
        address:recipient.address,
        latitude:recipient.latitude,
        longitude:recipient.longitude,
        createdAt:recipient.createdAt,
        updatedAt:recipient.updatedAt
    }
  }
}
