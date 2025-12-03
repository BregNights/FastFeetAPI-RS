import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Package } from "@/domain/carrier/enterprise/entities/package"
import { Prisma, Package as PrismaPackage } from "generated/prisma/client"

export class PrismaPackageMapper {
  static toDomain(raw: PrismaPackage): Package {
    return Package.create(
      {
        courierId: new UniqueEntityID(raw.courierId),
        description: raw.description ?? "",
        recipientId: new UniqueEntityID(raw.recipientId),
        trackingCode: raw.trackingCode,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(pkg: Package): Prisma.PackageUncheckedCreateInput {
    return {
      id: pkg.id.toString(),
      courierId: pkg.courierId.toString(),
      description: pkg.description ?? "",
      recipientId: pkg.recipientId.toString(),
      trackingCode: pkg.trackingCode,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }
  }
}
