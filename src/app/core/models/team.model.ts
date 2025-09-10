export interface Team {
  id: string;
  name: string;
  leadId: string;        // userId of team lead
  members: string[];     // array of userIds
  status: 'active' | 'inactive';
  createdAt: Date;
}
