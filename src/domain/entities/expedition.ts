import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export enum PackageStatus {
  WAITING = "WAITING",
  PICKED_UP = "PICKED_UP",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
}

interface ExpeditionProps {
  packageId: UniqueEntityID
  status: PackageStatus
  timestamp?: Date | null
}

export class Expedition extends Entity<ExpeditionProps> {
  get packageId() {
    return this.props.packageId
  }

  get status() {
    return this.props.status
  }

  set status(status: PackageStatus) {
    if (this.props.status !== status) {
      this.props.status = status
      this.touch()
    }
  }

  get timestamp() {
    return this.props.timestamp
  }

  private touch() {
    this.props.timestamp = new Date()
  }

  static create(
    props: Optional<ExpeditionProps, "timestamp">,
    id?: UniqueEntityID
  ) {
    const expedition = new Expedition(
      {
        ...props,
        timestamp: props.timestamp ?? new Date(),
      },
      id
    )

    return expedition
  }
}
