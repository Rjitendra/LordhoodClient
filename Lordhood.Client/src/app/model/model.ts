export enum ApplicationUserRoleType {
  None = 0,
  SuperAdmin = 1,
  Landlord = 2,
  Tenant = 3,
}

export interface ApplicationUserRole {
  id: ApplicationUserRoleType;
  name: string;
}

export interface ApplicationUser {
  applicationUserId: number;
  email: string;
  firstName: string;
  lastName: string;
  isEnabled: boolean;
  userName: string;
  userRoles: ApplicationUserRole[];
  password: string;
  isResetPassword: boolean;
}

export const ApplicationRoles: ApplicationUserRole[] = [
  { id: ApplicationUserRoleType.SuperAdmin, name: 'SuperAdmin' },
  { id: ApplicationUserRoleType.Landlord, name: 'Landlord' },
  { id: ApplicationUserRoleType.Tenant, name: 'Tenant' },
];

export interface IDropDown {
  name: string;
  id: number;
  isActive?: boolean;
}
