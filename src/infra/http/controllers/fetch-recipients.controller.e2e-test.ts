import { AppModule } from "@/app.module"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { CourierFactory } from "test/factories/make-courier"
import { PackageFactory } from "test/factories/make-package"
import { RecipientFactory } from "test/factories/make-recipient"
import { DatabaseModule } from "../../database/database.module"

describe("Fetch recipients (E2E)", () => {
  let app: INestApplication
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
    courierFactory = moduleRef.get(CourierFactory)
    packageFactory = moduleRef.get(PackageFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it("[GET] /recipients", async () => {
    const userAdmin = await courierFactory.makePrismaCourier({})
    const accessToken = jwt.sign({
      sub: userAdmin.id.toString(),
      role: Role.ADMIN,
    })

    Promise.all([
      await recipientFactory.makePrismaRecipient({
        name: "Stephanie",
      }),
      await recipientFactory.makePrismaRecipient({
        name: "John",
      }),
    ])

    const response = await request(app.getHttpServer())
      .get("/recipients")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ page: "1" })

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
        expect.objectContaining({
          name: "John",
        }),
        expect.objectContaining({
          name: "Stephanie",
        }),
      ]),
    })
  })
})
