export interface INotification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  key?: string;
  key_id?: string;
  is_read: boolean;
}
