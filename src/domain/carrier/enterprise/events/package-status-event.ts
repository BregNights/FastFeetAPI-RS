import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { DomainEvent } from "@/core/events/domain-event"
import { Package, PackageStatus } from "../entities/package"

export class PackageStatusEvent implements DomainEvent {
  public ocurredAt: Date
  public pkg: Package
  public status: PackageStatus

  constructor(pkg: Package, status: PackageStatus) {
    this.pkg = pkg
    this.status = status
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.pkg.id
  }
}
