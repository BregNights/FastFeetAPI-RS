import { Courier } from "../../enterprise/entities/courier"

export abstract class CouriersRepository {
  abstract create(courier: Courier): Promise<void>
  abstract findByEmail(email: string): Promise<Courier | null>
  abstract findByCPF(cpf: string): Promise<Courier | null>
  abstract findById(id: string): Promise<Courier | null>
  abstract findManyCouriers(page: number): Promise<Courier[]>
  abstract save(courier: Courier): Promise<void>
}
