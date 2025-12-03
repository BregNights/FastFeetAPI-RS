import { AppModule } from "@/app.module"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { CourierFactory } from "test/factories/make-courier"
import { RecipientFactory } from "test/factories/make-recipient"
import { DatabaseModule } from "../../database/database.module"

describe("Create package (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it("[POST] /packages", async () => {
    const user = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: Role.ADMIN })

    const recipient = await recipientFactory.makePrismaRecipient({})
    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/packages/${recipientId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "Description",
      })

    expect(response.statusCode).toBe(201)

    const packageOnDatabase = await prisma.package.findFirst({
      where: {
        description: "Description",
      },
    })

    expect(packageOnDatabase).toBeTruthy()
  })
})
