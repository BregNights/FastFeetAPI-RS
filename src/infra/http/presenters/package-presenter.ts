import { Package } from "@/domain/carrier/enterprise/entities/package"

export class PackagePresenter {
  static toHTTP(pkg: Package) {
    return {
      id: pkg.id.toString(),
      trackingCode: pkg.trackingCode,
      description: pkg.description,
      recipientId: pkg.recipientId.toString(),
      courierId: pkg.courierId?.toString() ?? null,
      status: pkg.status,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }
  }
}
