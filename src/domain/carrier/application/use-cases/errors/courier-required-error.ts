import { UseCaseError } from "@/core/errors/use-case-error"

export class CourierRequiredError extends Error implements UseCaseError {
  constructor() {
    super("CourierId is required when picking up a package")
  }
}
