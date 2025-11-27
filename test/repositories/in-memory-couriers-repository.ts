import { Courier } from "@/domain/entities/courier"
import { CouriersRepository } from "@/domain/repositories/couriers-repository"

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async create(courier: Courier): Promise<void> {
    this.items.push(courier)
  }

  async findByEmail(email: string): Promise<Courier | null> {
    const courier = this.items.find((item) => item.email === email)

    return courier || null
  }

  async findByCPF(cpf: string): Promise<Courier | null> {
    const courier = this.items.find((item) => item.cpf === cpf)

    return courier || null
  }
}
