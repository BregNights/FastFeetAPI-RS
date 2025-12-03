import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  Package,
  PackageProps,
} from "@/domain/carrier/enterprise/entities/package"
import { PrismaPackageMapper } from "@/infra/database/prisma/mappers/prisma-package-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makePackage(
  override: Partial<PackageProps> = {},
  id?: UniqueEntityID
) {
  const pkg = Package.create(
    {
      courierId: new UniqueEntityID(),
      description: faker.lorem.text(),
      recipientId: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return pkg
}

@Injectable()
export class PackageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPackage(data: Partial<PackageProps> = {}): Promise<Package> {
    const pkg = makePackage(data)

    await this.prisma.package.create({
      data: PrismaPackageMapper.toPrisma(pkg),
    })

    return pkg
  }
}
