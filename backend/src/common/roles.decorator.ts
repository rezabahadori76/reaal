import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const ROLE_LABELS: Record<UserRole, string> = {
  BUYER: 'Buyer',
  SELLER: 'Seller',
  BANK_OPS: 'Bank',
  APPRAISER: 'Valuation',
  ADMIN: 'Admin',
};
