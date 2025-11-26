import { Package } from "@/domain/entities/package"
import { PackagesRepository } from "@/domain/repositories/packages-repository"

export class InMemoryPackagesRepository implements PackagesRepository {
  public items: Package[] = []

  async create(pkg: Package): Promise<void> {
    this.items.push(pkg)
  }
}
