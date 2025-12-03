import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ValueObject } from "@/core/entities/value-object"

export interface PackageDetailsProps {
  packageId: UniqueEntityID
  trackingCode: string
  description?: string | null
  status: string
  recipientId: UniqueEntityID
  recipientName: string
  recipientPhone?: string | null
  recipientAddress: string
  createdAt: Date
  updatedAt?: Date | null
}

export class PackageDetails extends ValueObject<PackageDetailsProps> {
  get packageId() {
    return this.props.packageId
  }

  get trackingCode() {
    return this.props.trackingCode
  }

  get description() {
    return this.props.description
  }

  get status() {
    return this.props.status
  }

  get recipientId() {
    return this.props.recipientId
  }

  get recipientName() {
    return this.props.recipientName
  }

  get recipientPhone() {
    return this.props.recipientPhone
  }

  get recipientAddress() {
    return this.props.recipientAddress
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: PackageDetailsProps) {
    return new PackageDetails(props)
  }
}
