import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const ROLE_LABELS: Record<UserRole, string> = {
  BUYER: 'خریدار',
  SELLER: 'فروشنده',
  BANK_OPS: 'کارشناس بانک',
  APPRAISER: 'ارزیاب',
  ADMIN: 'مدیر',
};
