// types/pusher.d.ts

// Type for the data that will be received in Pusher events
interface ViewCounterData {
    count: number;
    monthlyCount: number;
    month: string;
    year: number;
    onlineCount: number;
    idleCount: number;
  }
  
  interface PusherChannel {
    bind(eventName: string, callback: (data: ViewCounterData) => void): void;
    unbind(eventName: string): void;
    subscribe(channelName: string): void;
    unsubscribe(channelName: string): void;
  }
  
  interface PusherConnection {
    bind(event: string, callback: () => void): void;
  }
  
  interface PusherClient {
    subscribe(channelName: string): PusherChannel;
    unsubscribe(channelName: string): void;
    connection: PusherConnection;
  }
  
  // Export the types if needed elsewhere
  export type { PusherChannel, PusherConnection, PusherClient, ViewCounterData };
