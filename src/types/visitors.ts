// types/visitors.ts
export interface VisitorData {
    monthlyCount: number;
    month: string;
    year: number;
    onlineCount: number;
    idleCount: number;
}

export type ConnectionStatus = 'online' | 'idle';

export interface StatusChangeRequest {
    status: ConnectionStatus;
}
