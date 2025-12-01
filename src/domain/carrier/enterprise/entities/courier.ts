import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface CourierProps {
  name: string
  cpf: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.updateProp(this.props.name, name, () => {
      this.props.name = name
    })
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.updateProp(this.props.email, email, () => {
      this.props.email = email
    })
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.updateProp(this.props.password, password, () => {
      this.props.password = password
    })
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

  static create(
    props: Optional<CourierProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const courier = new Courier(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return courier
  }
}
