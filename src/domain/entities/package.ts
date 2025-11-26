import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

interface PackageProps {
  trackingCode: string
  description: string
  recipientId: UniqueEntityID
  courierId: UniqueEntityID
  status: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Package extends Entity<PackageProps> {
  get trackingCode() {
    return this.props.trackingCode
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
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

  set status(status: string) {
    this.props.status = status
    this.touch()
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

  static create(
    props: Optional<PackageProps, "createdAt" | "status">,
    id?: UniqueEntityID
  ) {
    const pkg = new Package(
      {
        ...props,
        status: "WAITING",
        createdAt: new Date(),
      },
      id
    )

    return pkg
  }
}
