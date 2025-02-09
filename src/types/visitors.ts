// types/visitors.ts

export interface VisitorData {
    monthlyCount: number;
    month: string;
    year: number;
    onlineCount: number;
    idleCount: number;
}

export interface StatusChangeRequest {
    status: 'online' | 'idle';
}

export interface VisitorDetails {
    ip: string;
    deviceInfo: {
        deviceType: string;
        deviceName: string;
        deviceBrand: string;
        deviceModel: string;
        browser: string;
        os: string;
    } | null;
    lastSeen: string;
    userAgent: string;
}

export interface PusherError {
    error: string;
    code?: number;
    data?: Record<string, unknown>;
}

export interface VisitorInfo {
    ip: {
        forwardedFor: string;
        realIP: string;
        finalIP: string;
        isLocalhost: boolean;
    };
    device: {
        deviceType: string;
        deviceName: string;
        deviceBrand: string;
        deviceModel: string;
        browser: string;
        os: string;
        userAgent: string;
    };
}
