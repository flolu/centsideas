export interface IPushPayload {
  notification: {
    title: string;
    body: string;
    icon: string;
    vibrate?: number[];
    data?: {
      dateOfArrival: number;
      primaryKey: number;
    };
    actions?: { action: string; title: string }[];
  };
}
