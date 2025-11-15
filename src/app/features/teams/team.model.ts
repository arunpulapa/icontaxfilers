export interface Team {
  id?: number;
  name: number; 
  leadId?: number;
  members?: string[];
  status?: string;
  createdAt?: string | Date;
  leadName?: string;
  email?: string;
  phone?: string | number;
  deskNumber?: string;
  whatsapp?: string;
  copyPaste?: boolean;
}
