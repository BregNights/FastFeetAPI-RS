import { PackagesRepository } from "@/domain/carrier/application/repositories/packages-repository"
import { Package } from "@/domain/carrier/enterprise/entities/package"
import { PackageDetails } from "@/domain/carrier/enterprise/entities/value-objects/package-details"
import { Injectable } from "@nestjs/common"
import { PrismaPackageDetailsMapper } from "../mappers/prisma-package-details-mapper"
import { PrismaPackageMapper } from "../mappers/prisma-package-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaPackagesRepository implements PackagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(pkg: Package): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(pkg)

    await this.prisma.package.create({ data })
  }

  async findById(id: string): Promise<Package | null> {
    const pkg = await this.prisma.package.findUnique({ where: { id } })

    return pkg ? PrismaPackageMapper.toDomain(pkg) : null
  }

  async findDetailsById(id: string): Promise<PackageDetails | null> {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
      include: { recipient: true },
    })

    return pkg ? PrismaPackageDetailsMapper.toDomain(pkg) : null
  }

  async findManyPackages(page: number): Promise<Package[]> {
    const packages = await this.prisma.package.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    return packages.map(PrismaPackageMapper.toDomain)
  }

  async save(pkg: Package): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(pkg)

    await this.prisma.package.update({ where: { id: data.id }, data })
  }

  async delete(pkg: Package): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(pkg)

    await this.prisma.recipient.delete({ where: { id: data.id } })
  }
}
