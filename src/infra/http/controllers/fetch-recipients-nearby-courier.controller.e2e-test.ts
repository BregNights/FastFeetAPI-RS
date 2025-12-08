import { AppModule } from "@/app.module"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { PackageStatus } from "@/domain/carrier/enterprise/entities/package"
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
      providers: [CourierFactory, RecipientFactory, PackageFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    courierFactory = moduleRef.get(CourierFactory)
    packageFactory = moduleRef.get(PackageFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it("[GET] /recipients", async () => {
    const courier = await courierFactory.makePrismaCourier({})
    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: Role.COURIER,
    })

    const recipient1 = await recipientFactory.makePrismaRecipient({
      name: "1km Recipient",
      latitude: -26.9116251,
      longitude: -49.0712552,
    })

    const recipient2 = await recipientFactory.makePrismaRecipient({
      name: "2km Recipient",
      latitude: -26.908467,
      longitude: -49.072644,
    })

    await packageFactory.makePrismaPackage({
      courierId: courier.id,
      status: PackageStatus.PICKED_UP,
      recipientId: recipient1.id,
    })

    await packageFactory.makePrismaPackage({
      courierId: courier.id,
      status: PackageStatus.PICKED_UP,
      recipientId: recipient2.id,
    })

    const response = await request(app.getHttpServer())
      .get("/recipients/nearby")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ latitude: -26.91216, longitude: -49.070019 })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
        expect.objectContaining({
          name: "1km Recipient",
        }),
        expect.objectContaining({
          name: "2km Recipient",
        }),
      ]),
    })
  })
})
