import { AppModule } from "@/app.module"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { CourierFactory } from "test/factories/make-courier"
import { DatabaseModule } from "../../database/database.module"

describe("Create recipient (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let courierFactory: CourierFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it("[POST] /recipients", async () => {
    const user = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: Role.ADMIN })

    const response = await request(app.getHttpServer())
      .post("/recipients")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "John Doe",
        cpf: "123.456.789-00",
        phone: "4799999-9999",
        email: "johndoe@example.com",
        address: "Address example",
        latitude: 0,
        longitude: 0,
      })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        id: response.body.id,
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
