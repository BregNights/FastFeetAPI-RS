import { AuthenticateCourierUseCase } from "@/domain/carrier/application/use-cases/authenticate-courier"
import { RegisterCourierUseCase } from "@/domain/carrier/application/use-cases/register-courier"
import { RegisterPackageUseCase } from "@/domain/carrier/application/use-cases/register-package"
import { RegisterRecipientUseCase } from "@/domain/carrier/application/use-cases/register-recipient"
import { Module } from "@nestjs/common"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { DatabaseModule } from "../database/database.module"
import { AuthenticateController } from "./controllers/authenticate.controller"
import { RegisterAccountController } from "./controllers/register-account.controller"
import { RegisterPackageController } from "./controllers/register-package.controller"
import { RegisterRecipientController } from "./controllers/register-recipient.controller"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterAccountController,
    RegisterRecipientController,
    AuthenticateController,
    RegisterPackageController,
  ],
  providers: [
    RegisterCourierUseCase,
    RegisterRecipientUseCase,
    AuthenticateCourierUseCase,
    RegisterPackageUseCase,
  ],
})
export class HttpModule {}
