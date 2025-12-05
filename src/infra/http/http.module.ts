import { AuthenticateCourierUseCase } from "@/domain/carrier/application/use-cases/authenticate-courier"
import { DeleteCourierUseCase } from "@/domain/carrier/application/use-cases/delete-courier"
import { DeletePackageUseCase } from "@/domain/carrier/application/use-cases/delete-package"
import { DeleteRecipientUseCase } from "@/domain/carrier/application/use-cases/delete-recipient"
import { EditCourierUseCase } from "@/domain/carrier/application/use-cases/edit-courier"
import { EditPackageUseCase } from "@/domain/carrier/application/use-cases/edit-package"
import { EditPackageStatusUseCase } from "@/domain/carrier/application/use-cases/edit-package-status"
import { EditRecipientUseCase } from "@/domain/carrier/application/use-cases/edit-recipient"
import { FetchCouriersUseCase } from "@/domain/carrier/application/use-cases/fetch-couriers"
import { FetchPackagesByCourierUseCase } from "@/domain/carrier/application/use-cases/fetch-packages-by-courier"
import { FetchRecipientsUseCase } from "@/domain/carrier/application/use-cases/fetch-recipients"
import { RegisterCourierUseCase } from "@/domain/carrier/application/use-cases/register-courier"
import { RegisterPackageUseCase } from "@/domain/carrier/application/use-cases/register-package"
import { RegisterRecipientUseCase } from "@/domain/carrier/application/use-cases/register-recipient"
import { Module } from "@nestjs/common"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { DatabaseModule } from "../database/database.module"
import { AuthenticateController } from "./controllers/authenticate.controller"
import { DeleteAccountController } from "./controllers/delete-account.controller"
import { DeletePackageController } from "./controllers/delete-package.controller"
import { DeleteRecipientController } from "./controllers/delete-recipient.controller"
import { EditCourierController } from "./controllers/edit-courier.controller"
import { EditPackageStatusController } from "./controllers/edit-package-status.controller"
import { EditPackageController } from "./controllers/edit-package.controller"
import { EditRecipientController } from "./controllers/edit-recipient.controller"
import { FetchCouriersController } from "./controllers/fetch-couriers.controller"
import { FetchPackagesByCourierController } from "./controllers/fetch-packages-by-courier.controller"
import { FetchRecipientsController } from "./controllers/fetch-recipients.controller"
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
    DeleteAccountController,
    DeletePackageController,
    DeleteRecipientController,
    EditPackageController,
    EditPackageStatusController,
    EditCourierController,
    EditRecipientController,
    FetchPackagesByCourierController,
    FetchCouriersController,
    FetchRecipientsController,
  ],
  providers: [
    RegisterCourierUseCase,
    RegisterRecipientUseCase,
    AuthenticateCourierUseCase,
    RegisterPackageUseCase,
    DeleteCourierUseCase,
    DeleteRecipientUseCase,
    DeletePackageUseCase,
    EditPackageUseCase,
    EditPackageStatusUseCase,
    EditCourierUseCase,
    EditRecipientUseCase,
    FetchPackagesByCourierUseCase,
    FetchCouriersUseCase,
    FetchRecipientsUseCase,
  ],
})
export class HttpModule {}
