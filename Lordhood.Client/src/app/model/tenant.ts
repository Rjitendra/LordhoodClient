import { ApplicationUser } from './model';
import { IProperty } from './property';

export interface ITenant {
  id: number;
  landLordId: number;
  tenantId: number;
  propertyId: number;
  tenantGroup: number;
  rentDueDate: Date;

  agreementFileName: string;
  agreementFileData: any | null;
  rentGuideFileName: string;
  rentGuideFileData: any | null;
  depositCertificateDetail: string;
  isNewTenant: boolean;
  isAcknowledge: boolean;
  isActive: boolean;
  dateCreated?: Date;
  dateModified?: Date;
  tenantUser?: ITenantUser[];
  propertyPicture: IPropertyPicture[];
}

export interface ITenantResponse {
  id: number;
  landLordId: number;
  tenantId: number;
  propertyId: number;
  name?: string;
  email?: string;
  dOB?: Date;
  occupation?: string;
  tenantGroup?: number;
  rentAmout?: number;
  rentDueDate?: Date;
  tenancyStartDate: Date;
  isPrimary?: boolean;
  isAcknowledge?: boolean;
  acknowledgeDate?: Date;
  ipAddress?: string;
  backgroundCheckFileName?: string;
  backgroundCheckFileData?: any | null;
  agreementFileName?: string;
  agreementFileData?: any;
  rentGuideFileName?: string;
  rentGuideFileData?: any;
  depositCertificateDetail?: string;
  isNewTenant: boolean;
  isActive?: boolean;
  isRocConfirmed?: boolean;
  dateCreated?: string;
  dateModified?: string;
  user: ApplicationUser;
  property?: IProperty;
}

export interface ITenantUser {
  id: number;
  landLordId: number;
  tenantId: number;
  propertyId: number;
  name: string;
  email?: string;
  dOB: Date;
  occupation?: string;
  isPrimary: boolean;
  rentAmount: number;
  rentDueDate: Date;
  tenancyStartDate: Date;
  backgroundCheckFileName?: string;
  backgroundCheckFileData?: any | null;
}

export interface IOngoingTenancy {
  propertyId: number;
  tenantId: number;
  landLordId: number;
  name: string;
  address: string;
  propertyName: string;
  rentAmount: number;
  agreementFileData: any;
  agreementFileName: string;
  eicrFileName: string;
  eicrFileData: any;
  energyPerformanceFileName: string;
  energyPerformanceFileData?: any;
  gasSafetyFileName: string;
  gasSafetyFileData: any;
  rentGuideFileName: string;
  rentGuideFileData: any;
  isNewTenant: boolean;
  isAcknowledge: boolean;
  acknowledgeDate?: Date;

  propertyPicture?: IPropertyPicture[]; // picture upload by Landlord
  propertyPictureByTenant?: IPropertyPicture[];
}

export interface IPropertyPicture {
  id: number;
  landlordId: number;
  tenantId: number;
  propertyId: number;
  imageName: string;
  imageData: any;
  description?: string;
  dateCreated?: Date;
  dateModified?: Date;
  imageUrl?: string;
}

export interface ITenantFilter {
  id: number;
  landlordId: number;
  tenantId: number;
  propertyId: number;
  email?: string;
}

export interface ITenantAcknowledgeStaus {
  id: number;
  email: string;
  isAcknowledge: boolean;
  isPrimary: boolean;
}

export interface IROC {
  tenantName: string;
  landlordname: string;
  addressOfProperty: string;
  acknowledgeDate: Date;
  ipAddress: string;
}

export interface IUpdateTenantAgreement {
  tenantId: number;
  agreementFileName: string;
  agreementFileData: any;
  rentAmount: number;
}
