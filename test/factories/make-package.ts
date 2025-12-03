import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  Package,
  PackageProps,
} from "@/domain/carrier/enterprise/entities/package"
import { faker } from "@faker-js/faker"

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
