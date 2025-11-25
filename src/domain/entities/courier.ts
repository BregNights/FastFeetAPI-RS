import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

interface CourierProps {
  name: string
  cpf: string
  email: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<CourierProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const courier = new Courier(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    )

    return courier
  }
}
