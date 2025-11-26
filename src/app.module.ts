import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaService } from "./infra/database/prisma/prisma.service"
import { envSchema } from "./infra/env/env"
import { EnvModule } from "./infra/env/env.module"
import { CreateUserController } from "./infra/http/controllers/create-user.controller"

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
  ],
  controllers: [CreateUserController],
  providers: [PrismaService],
})
export class AppModule {}
