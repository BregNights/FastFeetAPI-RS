import {
  FindManyNearbyParams,
  RecipientsRepository,
} from "@/domain/carrier/application/repositories/recipients-repository"
import { Recipient } from "@/domain/carrier/enterprise/entities/recipient"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper"

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({ data })
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({ where: { id } })

    return recipient ? PrismaRecipientMapper.toDomain(recipient) : null
  }

  async findByCPF(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({ where: { cpf } })

    return recipient ? PrismaRecipientMapper.toDomain(recipient) : null
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Recipient[]> {
    const recipients = await this.prisma.$queryRaw<Recipient[]>`
    SELECT * from recipients
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10`

    return recipients
  }

  async findManyRecipients(page: number): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    return recipients.map(PrismaRecipientMapper.toDomain)
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({ where: { id: data.id }, data })
  }
}
