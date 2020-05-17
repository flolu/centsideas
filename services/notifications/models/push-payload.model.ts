export interface IPushPayload {
  notification: {
    title: string;
    body: string;
    icon?: string;
    vibrate?: number[];
    data?: any;
    actions?: {action: string; title: string}[];
  };
}
