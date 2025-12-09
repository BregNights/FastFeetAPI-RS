import { AppModule } from "@/app.module"
import { DomainEvents } from "@/core/events/domain-events"
import { waitFor } from "@/domain/carrier/application/utils/wait-for"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { PackageStatus } from "generated/prisma/enums"
import request from "supertest"
import { CourierFactory } from "test/factories/make-courier"
import { PackageFactory } from "test/factories/make-package"
import { RecipientFactory } from "test/factories/make-recipient"

describe("On Status Changed (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let courierFactory: CourierFactory
  let packageFactory: PackageFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, PackageFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    packageFactory = moduleRef.get(PackageFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it("should send a notification when status changed", async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: Role.COURIER,
    })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const pkg = await packageFactory.makePrismaPackage({
      recipientId: recipient.id,
    })

    const pkgId = pkg.id.toString()

    await request(app.getHttpServer())
      .patch(`/packages/${pkgId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status: PackageStatus.PICKED_UP,
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: { recipientId: recipient.id.toString() },
      })
      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
