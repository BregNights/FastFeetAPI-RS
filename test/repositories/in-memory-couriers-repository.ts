import { CouriersRepository } from "@/domain/carrier/application/repositories/couriers-repository"
import { Courier } from "@/domain/carrier/enterprise/entities/courier"

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

  async findById(id: string): Promise<Courier | null> {
    const courier = this.items.find((item) => item.id.toString() === id)

    return courier || null
  }

  async findManyCouriers(page: number): Promise<Courier[]> {
    const couriers = this.items.slice((page - 1) * 20, page * 20)

    return couriers
  }

  async save(courier: Courier): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id)

    this.items[itemIndex] = courier
  }

  async delete(courier: Courier): Promise<void> {
      const itemIndex = this.items.findIndex((item) => item.id === courier.id)
  
      this.items.splice(itemIndex, 1)
    }
}
