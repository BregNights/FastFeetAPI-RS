import { UseCaseError } from "@/core/errors/use-case-error"

export class NotThePickupCourierError extends Error implements UseCaseError {
  constructor() {
    super("This courier is not authorized to deliver this package.")
  }
}
