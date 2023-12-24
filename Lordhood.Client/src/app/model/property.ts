export interface IProperty {
  id: number;
  landLordId: number;
  name: string;
  address: string;
  profileOfTitleFileName: string;
  profileOfTitleFileData: any;
  gasSafetyFileName?: string;
  gasSafetyFileData?: any;
  gasSafetyExpiryDate?: Date;
  energyPerformanceFileName: string;
  energyPerformanceFileData: any;
  energyPerformanceExpiryDate: Date;
  floorPlanFileName?: string;
  floorPlanFileData?: any;
  eICRFileName: string;
  eICRFileData: any;
  eICRExpiryDate: Date;
  feature: string;

  councilInformation?: string;
  electricityProvider?: string;
  electricityProviderLatestReading?: string;
  electricityProviderDateOn?: Date;
  gasProvider?: string;
  gasProviderLatestReading?: string;
  gasProviderDateOn?: Date;
  waterProvider?: string;
  waterProviderLatestReading?: string;
  waterProviderDateOn?: Date;
  roomDetail?: string;
  toiletDetail?: string;
  postcode?: string;
  spaceDetail?: string;
  isFurnished?: boolean;
  dateOfAvailability?: Date;

  active?: boolean;
  dateCreated?: Date;
  dateModified?: Date;
  whiteGoods?: IWhiteGoods[];
}

export interface IImagesOfPropertyBeforeLet {
  id: number;
  imageName: string;
  imageData: File;
  description?: string;
  propertyId: number;
}

export interface IFloorPlan {
  id: number;
  fileName: string;
  fileData: any;
  description?: string;
  propertyId: number;
}

export interface IWhiteGoods {
  id: number;
  name?: string;
  make?: string;
  model?: string;
  serialNo?: string;
  description?: string;
  propertyId?: number;
}

export interface IUpdateCertificates {
  propertyId: number;
  gasSafetyFileName?: string;
  gasSafetyFileData?: any;
  gasSafetyExpiryDate?: Date;
  energyPerformanceFileName?: string;
  energyPerformanceFileData?: any;
  energyPerformanceExpiryDate?: Date;
  eICRFileName?: string;
  eICRFileData?: any;
  eICRExpiryDate?: Date;
}

export interface IBoard {
  tenantId: number;
  propertyName: string;
  name: string;
  rentAmount?: number;
  totalIssue: number;
  rentDue: number;
  rentPaid: number;
  nextRentDueOn?: Date;
}

export enum DownloadType {
  ProofOfTitle = 1,
  EICRCertificate = 2,
  GasSafetyCertificate = 3,
  EPCCertificate = 4,
  FloorPlan = 5,
  TenancyAgreement = 6,
  RentGuide = 7,
}
