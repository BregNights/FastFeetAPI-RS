import { Courier } from "../entities/courier"
import { CouriersRepository } from "../repositories/couriers-repository"
import { RegisterCourierUseCase } from "./register-courier"

const fakeCouriersRepository: CouriersRepository = {
  create: async (courier: Courier) => {
    return
  },
}

it("Register an courier", async () => {
  const registerCourier = new RegisterCourierUseCase(fakeCouriersRepository)

  const courier = await registerCourier.execute({
    name: "example",
    cpf: "123;456;789-00",
    email: "example@example.com",
  })

  expect(courier.name).toEqual("example")
})
