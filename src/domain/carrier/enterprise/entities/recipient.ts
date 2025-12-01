import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface RecipientProps {
  name: string
  cpf: string
  phone?: string | null
  email?: string | null
  address: string
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Recipient extends Entity<RecipientProps> {
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

  get phone() {
    return this.props.phone
  }

  set phone(phone: string | null | undefined) {
    this.updateProp(this.props.phone, phone, () => {
      this.props.phone = phone
    })
  }

  get email() {
    return this.props.email
  }

  set email(email: string | null | undefined) {
    this.updateProp(this.props.email, email, () => {
      this.props.email = email
    })
  }

  get address() {
    return this.props.address
  }

  set address(address: string) {
    this.updateProp(this.props.address, address, () => {
      this.props.address = address
    })
  }

  get latitude() {
    return this.props.latitude
  }

  set latitude(latitude: number) {
    this.updateProp(this.props.latitude, latitude, () => {
      this.props.latitude = latitude
    })
  }

  get longitude() {
    return this.props.longitude
  }

  set longitude(longitude: number) {
    this.updateProp(this.props.longitude, longitude, () => {
      this.props.longitude = longitude
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

  update(data: Partial<RecipientProps>) {
    if (data.name) this.name = data.name
    if (data.phone) this.phone = data.phone
    if (data.email) this.email = data.email
    if (data.address) this.address = data.address
    if (data.latitude) this.latitude = data.latitude
    if (data.longitude) this.longitude = data.longitude
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
