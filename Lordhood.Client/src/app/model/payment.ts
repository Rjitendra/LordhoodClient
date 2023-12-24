export interface IPaymentDetails {
  id: number;
  month: Date;
  rentDate: Date;
  rentAmount: number;
  rentPaid: number;
  lastRentPaidDate?: Date;
  paymentMode?: string;
  rentDue: number;
  latePaymentCharges: number;
  comments: string;
}

export interface IRentReport {
  id: number;
  tenantId: number;
  propertyId: number;
  propertyName: string;
  tenantName: string;
  month: string;
  rentDate: Date;
  rentAmount: number;
  rentPaid: number;
  lastRentPaidDate?: string;
  paymentMode?: string;
  rentDue: number;
  latePaymentCharges: number;
  comments: string;
  rentHistory?: IRentPaymentHistory[];
}

export interface IRentPaymentHistory {
  id: number;
  tenantId: number;
  rentPaid: number;
  rentDate: Date;
  paymentMode: string;
  dateCreated: Date;
}

export interface IRentReportFilter {
  period: string;
  propertyFilter: string;
  landlordId: number;
}

export interface IRentReportGroup {
  [key: string]: IRentReport[];
}

export interface IAccountLinkResponse {
  object: string;
  created: Date;
  expiresAt: Date;
  url: string;
}

export interface IPaymentRequest {
  amount: number;
  landlorId: number;
  tenantGroup: number;
}
