import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  Courier,
  CourierRole,
} from "@/domain/carrier/enterprise/entities/courier"
import { Prisma, User as PrismaUser } from "generated/prisma/client"

export class PrismaCourierMapper {
  static toDomain(raw: PrismaUser): Courier {
    return Courier.create(
      {
        name: raw.name,
        email: raw.email,
        cpf: raw.cpf,
        role: raw.role as CourierRole,
        password: raw.password,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      email: courier.email,
      cpf: courier.cpf,
      role: courier.role,
      password: courier.password,
    }
  }
}
