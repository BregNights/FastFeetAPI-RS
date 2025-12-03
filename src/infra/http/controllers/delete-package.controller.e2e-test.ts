import { AppModule } from "@/app.module"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"

import { CourierFactory } from "test/factories/make-courier"
import { PackageFactory } from "test/factories/make-package"
import { RecipientFactory } from "test/factories/make-recipient"
import { DatabaseModule } from "../../database/database.module"

describe("Delete Package (E2E)", () => {
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

  it("[DELETE] /packages/:id", async () => {
    const useradmin = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({
      sub: useradmin.id.toString(),
      role: Role.ADMIN,
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    const pkg = await packageFactory.makePrismaPackage({
      recipientId: recipient.id,
      courierId: useradmin.id,
    })
    const pkgId = pkg.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/packages/${pkgId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.package.findUnique({
      where: {
        id: pkgId,
      },
    })

    expect(userOnDatabase).toBeNull()
  })
})
