export interface RegraNotificacao {
  id: string;
  identification: string;
  activ: boolean;
  init: boolean;
  end: boolean;
  notify_every: number;
  notify_after: number;
  type: string;
  priority: string;
  reason__codes: any;
  users: any;
}
