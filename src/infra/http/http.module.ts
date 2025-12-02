import { AuthenticateCourierUseCase } from "@/domain/carrier/application/use-cases/authenticate-courier"
import { RegisterCourierUseCase } from "@/domain/carrier/application/use-cases/register-courier"
import { RegisterRecipientUseCase } from "@/domain/carrier/application/use-cases/register-recipient"
import { Module } from "@nestjs/common"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { AuthenticateController } from "./controllers/authenticate-controller"
import { CreateAccountController } from "./controllers/create-account.controller"
import { CreateRecipientController } from "./controllers/create-recipient.controller"
import { DatabaseModule } from "./database/database.module"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateRecipientController,
    AuthenticateController,
  ],
  providers: [
    RegisterCourierUseCase,
    RegisterRecipientUseCase,
    AuthenticateCourierUseCase,
  ],
})
export class HttpModule {}
