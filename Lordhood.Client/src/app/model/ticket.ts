import { ITenant } from './tenant';

export interface ITicket {
  id: number;
  landlordId: number;
  tenantId: number;
  tenantGroupId: number;
  propertyId: number;
  category: string;
  description: string;
  dateCreated: Date;
  status: ITicketStatus[];
  tenantName?: string;
  propertyName?: string;
}
export interface ITicketStatus {
  id: number;
  ticketId: number;
  addedBy?: number;
  status: string;
  comment: string;
  dateCreated: Date;
  dateModified?: Date;
}

export interface ITicketHistory {
  status: string;
  comment: string;
  name: string;
  createdDate: Date;
}
