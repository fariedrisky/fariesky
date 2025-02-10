// types/visitors.ts
export interface StatusChangeRequest {
    status: 'online' | 'offline';
}

export interface VisitorData {
    monthlyCount: number;
    month: string;
    year: number;
    onlineCount: number;
}
