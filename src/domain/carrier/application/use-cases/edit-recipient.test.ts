import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { EditRecipientUseCase } from "./edit-recipient"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditRecipientUseCase

describe("Edit Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientsRepository)
  })

  it("should be able to edit a recipient", async () => {
    const recipient = makeRecipient({ name: "example" })

    inMemoryRecipientsRepository.items.push(recipient)

    await sut.execute({
      recipientId: recipient.id.toString(),
      data: {
        name: "John Doe",
      },
    })

    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      name: "John Doe",
    })
  })
})
