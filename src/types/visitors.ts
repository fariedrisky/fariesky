// types/visitors.ts
export interface VisitorData {
    monthlyCount: number;
    month: string;
    year: number;
    onlineCount: number;
    idleCount: number;
}

export interface StatusChangeRequest {
    status: 'online' | 'idle' | 'offline';
}

export interface PusherError {
    type: string;
    data: {
        code: number;
        message: string;
    };
}

export interface DeviceInfo {
    browser: string;
    browserVersion: string;
    os: string;
    deviceType: string;
    deviceName: string;
}

export interface VisitorDetails {
    id: string;
    userAgent: string;
    deviceInfo: DeviceInfo;
    lastSeen: string;
    status: 'online' | 'idle' | 'offline';
}
