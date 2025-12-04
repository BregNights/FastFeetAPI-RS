import { UseCaseError } from "@/core/errors/use-case-error"

export class DeliveredWithoutPickedup extends Error implements UseCaseError {
  constructor() {
    super("Package must be PICKED_UP before being DELIVERED")
  }
}
