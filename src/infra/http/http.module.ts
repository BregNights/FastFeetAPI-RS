import { RegisterCourierUseCase } from "@/domain/carrier/application/use-cases/register-courier"
import { Module } from "@nestjs/common"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { CreateAccountController } from "./controllers/create-account.controller"
import { DatabaseModule } from "./database/database.module"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [RegisterCourierUseCase],
})
export class HttpModule {}
