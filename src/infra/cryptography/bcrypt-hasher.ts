import { HashComparer } from "@/domain/carrier/application/cryptography/hash-comparer"
import { HashGenerator } from "@/domain/carrier/application/cryptography/hash-generator"
import { compare, hash } from "bcryptjs"

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGHT = 6

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGHT)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
