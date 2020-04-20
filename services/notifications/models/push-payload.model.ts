export interface IPushPayload {
  notification: {
    title: string;
    body: string;
    // TODO can url be set here or do we have to listen for click event in service worker?
    icon?: string;
    vibrate?: number[];
    data?: any;
    actions?: { action: string; title: string }[];
  };
}
