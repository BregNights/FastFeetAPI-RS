import { Package } from "../entities/package"

export interface PackagesRepository {
  create(pkg: Package): Promise<void>
}
