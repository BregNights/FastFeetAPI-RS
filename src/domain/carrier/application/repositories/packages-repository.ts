import { Package } from "../../enterprise/entities/package"
import { PackageDetails } from "../../enterprise/entities/value-objects/package-details"

export abstract class PackagesRepository {
  abstract create(pkg: Package): Promise<void>
  abstract findById(id: string): Promise<Package | null>
  abstract findDetailsById(id: string): Promise<PackageDetails | null>
  abstract findManyPackages(page: number): Promise<Package[]>
  abstract save(pkg: Package): Promise<void>
  abstract delete(pkg: Package): Promise<void>
}
