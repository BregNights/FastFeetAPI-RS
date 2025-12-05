import { AppModule } from "@/app.module"
import { HashComparer } from "@/domain/carrier/application/cryptography/hash-comparer"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { CryptographyModule } from "@/infra/cryptography/cryptography.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { CourierFactory } from "test/factories/make-courier"
import { DatabaseModule } from "../../database/database.module"

describe("Edit courier (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let hashComparer: HashComparer
  let courierFactory: CourierFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    hashComparer = moduleRef.get(HashComparer)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it("[Patch] /couriers/:courierId/password", async () => {
    const userAdmin = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({
      sub: userAdmin.id.toString(),
      role: Role.ADMIN,
    })

    const user = await courierFactory.makePrismaCourier()
    const userId = user.id.toString()

    const newPassword = "NewPassowrd"

    const response = await request(app.getHttpServer())
      .patch(`/couriers/${userId}/password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        password: newPassword,
      })

    expect(response.statusCode).toBe(204)

    const courierOnDatabase = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    const isValid = await hashComparer.compare(
      newPassword,
      courierOnDatabase!.password
    )

    expect(isValid).toBe(true)
  })
})
