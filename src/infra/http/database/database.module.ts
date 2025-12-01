import { CouriersRepository } from "@/domain/carrier/application/repositories/couriers-repository"
import { Module } from "@nestjs/common"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { PrismaCouriersRepository } from "./prisma/repositories/prisma-couriers-repository"

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
  ],
  exports: [PrismaService, CouriersRepository],
})
export class DatabaseModule {}
