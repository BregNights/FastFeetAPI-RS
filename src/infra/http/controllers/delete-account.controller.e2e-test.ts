import { AppModule } from "@/app.module"
import { Role } from "@/domain/carrier/enterprise/entities/courier"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { CourierFactory } from "test/factories/make-courier"
import { DatabaseModule } from "../../database/database.module"

describe("Delete account (E2E)", () => {
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

  it("[DELETE] /accounts/:id", async () => {
    const useradmin = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({
      sub: useradmin.id.toString(),
      role: Role.ADMIN,
    })

    const user = await courierFactory.makePrismaCourier()
    const userId = user.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/accounts/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    expect(userOnDatabase).toBeNull()
  })
})
