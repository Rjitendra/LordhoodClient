export interface ILandlord {
  id: number;
  landlordId: number;
  address?: string;
  postcode?: string;
  phone: string;
  ownershipDoc?: IOwnershipDoc[];
  proofOfAddress?: IProofOfAddress[];
  idProof?: IIdProof;
  agencyAgreement?: IAgencyAgreement;
  registeredOrganizationDetail?: IRegisteredOrganizationDetail;
}

export interface IIdProof {
  id: number;
  landlordId: number;
  fileName: string;
  file: File;
  description?: string;
}

export interface IOwnershipDoc {
  id: number;
  landlordId: number;
  ownershipDocFileName: string;
  ownershipDocFileData: string;
  description?: string;
}

export interface IProofOfAddress {
  id: number;
  landlordId: number;
  proofOfAddressFileName: string;
  proofOfAddressFileData: string;
  description?: string;
}

export interface IAgencyAgreement {
  id: number;
  landlordId: number;
  fileName: string;
  file: File;
  description?: string;
}

export interface IRegisteredOrganizationDetail {
  id: number;
  landlordId: number;
  fileName: string;
  file: File;
  description?: string;
}

export interface ILandlordProfile {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  postcode: string;
  phoneNumber: string;
  isUpdatedAccount: boolean;
  dateCreated: Date | null;
  dateExpiry: Date | null;
  isRenew: boolean | null;
}
