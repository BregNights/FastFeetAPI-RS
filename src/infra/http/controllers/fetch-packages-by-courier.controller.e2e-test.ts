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

describe("Fetch packages (E2E)", () => {
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

  it("[GET] /packages/:courierId", async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: Role.COURIER,
    })
    const courierId = courier.id.toString()

    const recipient = await recipientFactory.makePrismaRecipient()

    Promise.all([
      packageFactory.makePrismaPackage({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
      packageFactory.makePrismaPackage({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/packages/${courierId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      package: expect.arrayContaining([
        expect.objectContaining({
          courierId: courier.id.toString(),
          recipientId: recipient.id.toString(),
        }),
        expect.objectContaining({
          courierId: courier.id.toString(),
          recipientId: recipient.id.toString(),
        }),
      ]),
    })
  })
})
