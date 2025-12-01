import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { FetchRecipientsUseCase } from "./fetch-recipients"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchRecipientsUseCase

describe("Fetch Recipient Use Case", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository)
  })

  it("should be able to fetch recipient", async () => {
    for (let i = 1; i <= 22; i++) {
      const recipient = makeRecipient()
      inMemoryRecipientsRepository.items.push(recipient)
    }

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.recipient).toHaveLength(20)
  })

  it("should be able to fetch paginated recipient", async () => {
    for (let i = 1; i <= 22; i++) {
      const recipient = makeRecipient()
      inMemoryRecipientsRepository.items.push(recipient)
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.recipient).toHaveLength(2)
  })
})
