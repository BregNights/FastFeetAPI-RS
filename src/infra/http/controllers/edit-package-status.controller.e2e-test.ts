import { AppModule } from "@/app.module"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { PackageStatus } from "@/domain/carrier/enterprise/entities/package"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { CourierFactory } from "test/factories/make-courier"
import { PackageFactory } from "test/factories/make-package"
import { RecipientFactory } from "test/factories/make-recipient"
import { DatabaseModule } from "../../database/database.module"

describe("Edit package (E2E)", () => {
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

    await app.init()
  })

  it("[PUT] /packages/:packageId/status", async () => {
    const user = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: Role.COURIER,
    })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const pkg = await packageFactory.makePrismaPackage({
      recipientId: recipient.id,
      description: "Package of packages",
    })

    const pkgId = pkg.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/packages/${pkgId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status: PackageStatus.PICKED_UP,
      })

    expect(response.statusCode).toBe(204)

    const packageOnDatabase = await prisma.package.findFirst({
      where: {
        id: pkgId,
      },
    })

    console.log(packageOnDatabase)

    expect(packageOnDatabase).toBeTruthy()
  })
})
