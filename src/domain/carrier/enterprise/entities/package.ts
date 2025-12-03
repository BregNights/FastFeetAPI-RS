import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { PackageStatusEvent } from "../events/package-status-event"

export enum PackageStatus {
  WAITING = "WAITING",
  PICKED_UP = "PICKED_UP",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
}

export interface PackageProps {
  trackingCode: string
  description: string
  recipientId: UniqueEntityID
  courierId: UniqueEntityID
  status: PackageStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class Package extends AggregateRoot<PackageProps> {
  get trackingCode() {
    return this.props.trackingCode
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.updateProp(this.props.description, description, () => {
      this.props.description = description
    })
  }

  get recipientId() {
    return this.props.recipientId
  }

  get courierId() {
    return this.props.courierId
  }

  get status() {
    return this.props.status
  }

  set status(status: PackageStatus) {
    this.updateProp(this.props.status, status, () => {
      this.props.status = status
    })

    if (status) {
      this.addDomainEvent(new PackageStatusEvent(this, status))
    }
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  private updateProp<T>(current: T, next: T, assign: () => void) {
    if (current !== next) {
      assign()
      this.touch()
    }
  }

  private static generateTrackingCode(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const prefix =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)]

    const numbers = Math.floor(100000000 + Math.random() * 900000000)

    const suffix = "BR"

    return `${prefix}${numbers}${suffix}`
  }

  static create(
    props: Optional<PackageProps, "createdAt" | "status" | "trackingCode">,
    id?: UniqueEntityID
  ) {
    const pkg = new Package(
      {
        ...props,
        trackingCode: props.trackingCode ?? Package.generateTrackingCode(),
        status: props.status ?? PackageStatus.WAITING,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    const isNewStatus = !id
    if (isNewStatus) {
      pkg.addDomainEvent(new PackageStatusEvent(pkg, pkg.status))
    }

    return pkg
  }
}
