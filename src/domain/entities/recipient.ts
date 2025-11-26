import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

interface RecipientProps {
  name: string
  cpf: string
  phone?: string | null
  email?: string | null
  address: string
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt?: Date | null
  packageId: UniqueEntityID
  courierId: UniqueEntityID
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get phone() {
    return this.props.phone
  }

  get email() {
    return this.props.email
  }

  get address() {
    return this.props.address
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get packageId() {
    return this.props.packageId
  }

  get courierId() {
    return this.props.courierId
  }

  static create(
    props: Optional<RecipientProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return recipient
  }
}
