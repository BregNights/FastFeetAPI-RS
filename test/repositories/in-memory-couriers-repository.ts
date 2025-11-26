import { Courier } from "@/domain/entities/courier"
import { CouriersRepository } from "@/domain/repositories/couriers-repository"

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async create(courier: Courier): Promise<void> {
    this.items.push(courier)
  }
}
