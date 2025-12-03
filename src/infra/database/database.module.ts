import { CouriersRepository } from "@/domain/carrier/application/repositories/couriers-repository"
import { PackagesRepository } from "@/domain/carrier/application/repositories/packages-repository"
import { RecipientsRepository } from "@/domain/carrier/application/repositories/recipients-repository"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { Module } from "@nestjs/common"
import { PrismaCouriersRepository } from "./prisma/repositories/prisma-couriers-repository"
import { PrismaPackagesRepository } from "./prisma/repositories/prisma-packages-repository"
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipients-repository"

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: PackagesRepository,
      useClass: PrismaPackagesRepository,
    },
  ],
  exports: [
    PrismaService,
    CouriersRepository,
    RecipientsRepository,
    PackagesRepository,
  ],
})
export class DatabaseModule {}
