import { Package } from "../entities/package"

export interface PackageRepository {
  create(pkg: Package): Promise<void>
}
