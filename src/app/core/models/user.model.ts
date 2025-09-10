export type UserRole = 'admin' | 'team-lead' | 'team-mate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string; // link to team if team-lead or team-mate
}
