import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Recipient } from "@/domain/carrier/enterprise/entities/recipient"
import { Prisma, Recipient as PrismaRecipient } from "generated/prisma/client"

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        phone: raw.phone,
        email: raw.email,
        address: raw.address,
        latitude: raw.latitude ?? 0,
        longitude: raw.longitude ?? 0,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf,
      phone: recipient.phone ?? "",
      email: recipient.email,
      address: recipient.address,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
