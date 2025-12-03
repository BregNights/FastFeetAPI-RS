import { DomainEvents } from "@/core/events/domain-events"
import { CouriersRepository } from "@/domain/carrier/application/repositories/couriers-repository"
import { Courier } from "@/domain/carrier/enterprise/entities/courier"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import { PrismaCourierMapper } from "../mappers/prisma-courier-mapper"

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({ where: { email } })

    return courier ? PrismaCourierMapper.toDomain(courier) : null
  }

  async findByCPF(cpf: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({ where: { cpf } })

    return courier ? PrismaCourierMapper.toDomain(courier) : null
  }

  async findById(id: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({ where: { id } })

    return courier ? PrismaCourierMapper.toDomain(courier) : null
  }

  async findManyCouriers(page: number): Promise<Courier[]> {
    const couriers = await this.prisma.user.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    return couriers.map(PrismaCourierMapper.toDomain)
  }

  async save(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.update({ where: { id: data.id }, data })

    DomainEvents.dispatchEventsForAggregate(courier.id)
  }

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.create({ data })
  }

  async delete(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.recipient.delete({ where: { id: data.id } })
  }
}
