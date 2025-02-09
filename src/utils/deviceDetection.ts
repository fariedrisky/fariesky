// utils/deviceDetection.ts
import { DeviceInfo } from '@/types/visitors';

export function getDeviceInfo(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase();

    // Browser detection
    let browser = 'Unknown';
    let browserVersion = '';

    if (ua.includes('firefox')) {
        browser = 'Firefox';
        const match = ua.match(/firefox\/([\d.]+)/);
        browserVersion = match ? match[1] : '';
    } else if (ua.includes('edg')) {
        browser = 'Edge';
        const match = ua.match(/edg\/([\d.]+)/);
        browserVersion = match ? match[1] : '';
    } else if (ua.includes('chrome')) {
        browser = 'Chrome';
        const match = ua.match(/chrome\/([\d.]+)/);
        browserVersion = match ? match[1] : '';
    } else if (ua.includes('safari')) {
        browser = 'Safari';
        const match = ua.match(/version\/([\d.]+)/);
        browserVersion = match ? match[1] : '';
    }

    // OS detection
    let os = 'Unknown';
    if (ua.includes('windows')) {
        os = 'Windows';
    } else if (ua.includes('mac os')) {
        os = 'macOS';
    } else if (ua.includes('linux')) {
        os = 'Linux';
    } else if (ua.includes('android')) {
        os = 'Android';
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
        os = 'iOS';
    }

    // Device type detection
    let deviceType = 'Desktop';
    let deviceName = 'Computer';

    if (ua.includes('mobile')) {
        deviceType = 'Mobile';
        deviceName = 'Smartphone';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
        deviceType = 'Tablet';
        deviceName = 'Tablet';
    }

    return {
        browser,
        browserVersion,
        os,
        deviceType,
        deviceName
    };
}
