import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { PackageDetails } from "@/domain/carrier/enterprise/entities/value-objects/package-details"
import {
  Package as PrismaPackage,
  Recipient as PrismaRecipient,
} from "generated/prisma/client"

type PrismaPackageDetails = PrismaPackage & {
  recipient: PrismaRecipient
}

export class PrismaPackageDetailsMapper {
  static toDomain(raw: PrismaPackageDetails): PackageDetails {
    return PackageDetails.create({
      packageId: new UniqueEntityID(raw.id),
      trackingCode: raw.trackingCode,
      description: raw.description,
      status: raw.status,
      recipientId: new UniqueEntityID(raw.recipientId),
      recipientName: raw.recipient.name,
      recipientPhone: raw.recipient.phone,
      recipientAddress: raw.recipient.address,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
