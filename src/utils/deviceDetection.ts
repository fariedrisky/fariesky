// utils/deviceDetection.ts
import { DeviceInfo } from '@/types/visitors';

function getBrowserInfo(ua: string): { browser: string; browserVersion: string } {
    const browsers = [
        { name: 'Edge', pattern: /edg(?:e|ios|a)?\/([\d.]+)/i },
        { name: 'Chrome', pattern: /(?:chrome|crios)\/([\d.]+)/i },
        { name: 'Firefox', pattern: /(?:firefox|fxios)\/([\d.]+)/i },
        { name: 'Safari', pattern: /version\/([\d.]+).*safari/i },
        { name: 'Samsung Browser', pattern: /samsungbrowser\/([\d.]+)/i },
        { name: 'Opera', pattern: /(?:opera|opr)\/([\d.]+)/i },
    ];

    for (const browserInfo of browsers) {
        const match = ua.match(browserInfo.pattern);
        if (match) {
            return {
                browser: browserInfo.name,
                browserVersion: match[1] || ''
            };
        }
    }

    // Special case for Safari without version string
    if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android')) {
        return {
            browser: 'Safari',
            browserVersion: ''
        };
    }

    return {
        browser: 'Unknown',
        browserVersion: ''
    };
}

function getOSInfo(ua: string): string {
    const osPatterns = [
        { name: 'iOS', pattern: /ip(?:hone|ad|od)/i },
        { name: 'Android', pattern: /android/i },
        { name: 'Windows', pattern: /windows(?:.*)nt/i },
        { name: 'macOS', pattern: /macintosh|mac os x/i },
        { name: 'Linux', pattern: /linux|x11/i },
        { name: 'Chrome OS', pattern: /cros/i },
    ];

    for (const osInfo of osPatterns) {
        if (osInfo.pattern.test(ua)) {
            return osInfo.name;
        }
    }

    return 'Unknown';
}

function getDeviceTypeInfo(ua: string): { deviceType: string; deviceName: string } {
    // Check for tablets first
    if (
        /ipad/i.test(ua) ||
        /tablet|playbook/i.test(ua) ||
        (/android/i.test(ua) && !/mobile/i.test(ua))
    ) {
        return {
            deviceType: 'Tablet',
            deviceName: 'Tablet'
        };
    }

    // Check for mobile devices
    if (
        /mobile|ip(hone|od)|android|blackberry|iemobile|kindle|netfront|silk-accelerated|(hpw|web)os|fennec|minimo|opera m(obi|ini)|blazer|dolfin|dolphin|skyfire|zune/i.test(ua)
    ) {
        return {
            deviceType: 'Mobile',
            deviceName: 'Smartphone'
        };
    }

    // Specific device detection for better logging
    const devicePatterns = [
        { pattern: /iphone/i, type: 'Mobile', name: 'iPhone' },
        { pattern: /ipad/i, type: 'Tablet', name: 'iPad' },
        { pattern: /android.*mobile/i, type: 'Mobile', name: 'Android Phone' },
        { pattern: /android(?!.*mobile)/i, type: 'Tablet', name: 'Android Tablet' },
        { pattern: /windows phone/i, type: 'Mobile', name: 'Windows Phone' },
    ];

    for (const device of devicePatterns) {
        if (device.pattern.test(ua)) {
            return {
                deviceType: device.type,
                deviceName: device.name
            };
        }
    }

    // Default to desktop
    return {
        deviceType: 'Desktop',
        deviceName: 'Computer'
    };
}

export function getDeviceInfo(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase();
    const { browser, browserVersion } = getBrowserInfo(ua);
    const os = getOSInfo(ua);
    const { deviceType, deviceName } = getDeviceTypeInfo(ua);

    // Log device detection details for debugging
    console.log('Device Detection:', {
        userAgent,
        browser,
        browserVersion,
        os,
        deviceType,
        deviceName,
        timestamp: new Date().toISOString()
    });

    return {
        browser,
        browserVersion,
        os,
        deviceType,
        deviceName
    };
}

// Add a type guard for better type safety
export function isValidDeviceInfo(info: string | DeviceInfo): info is DeviceInfo {
    return (
        typeof info === 'object' &&
        info !== null &&
        typeof info.browser === 'string' &&
        typeof info.browserVersion === 'string' &&
        typeof info.os === 'string' &&
        typeof info.deviceType === 'string' &&
        typeof info.deviceName === 'string'
    );
}
