// utils/deviceDetection.ts

export interface DeviceInfo {
    deviceType: string;
    deviceName: string;
    browser: string;
    os: string;
}

export function getDeviceInfo(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase();

    let deviceType = 'Desktop';
    let deviceName = 'Unknown Device';
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    // Detect device type and name
    if (ua.includes('mobile')) {
        deviceType = 'Mobile';

        // Detect specific mobile devices
        if (ua.includes('samsung')) {
            if (ua.includes('sm-a')) {
                deviceName = 'Samsung Galaxy A Series';
                // Try to get specific model
                const model = ua.match(/sm-a\d{3}/i);
                if (model) {
                    deviceName = `Samsung ${model[0].toUpperCase()}`;
                }
            } else if (ua.includes('sm-s')) {
                deviceName = 'Samsung Galaxy S Series';
                const model = ua.match(/sm-s\d{3}/i);
                if (model) {
                    deviceName = `Samsung ${model[0].toUpperCase()}`;
                }
            }
        } else if (ua.includes('iphone')) {
            deviceName = 'iPhone';
            const match = ua.match(/iphone\s*(?:os\s*)?(\d+)/i);
            if (match) {
                deviceName = `iPhone (iOS ${match[1]})`;
            }
        } else if (ua.includes('xiaomi')) {
            deviceName = 'Xiaomi Phone';
            // Try to get Xiaomi model
            const model = ua.match(/redmi\s([a-z0-9]+)/i) || ua.match(/mi\s([a-z0-9]+)/i);
            if (model) {
                deviceName = `Xiaomi ${model[0]}`;
            }
        } else if (ua.includes('oppo')) {
            deviceName = 'OPPO Phone';
            const model = ua.match(/(?:oppo\s)?([a-z][0-9]+[a-z]?)/i);
            if (model) {
                deviceName = `OPPO ${model[0].toUpperCase()}`;
            }
        } else if (ua.includes('vivo')) {
            deviceName = 'Vivo Phone';
            const model = ua.match(/vivo\s([a-z0-9]+)/i);
            if (model) {
                deviceName = `Vivo ${model[0]}`;
            }
        }
    } else if (ua.includes('tablet')) {
        deviceType = 'Tablet';
        if (ua.includes('ipad')) {
            deviceName = 'iPad';
            // Try to get iPad model/generation
            const match = ua.match(/ipad\s*(?:os\s*)?(\d+)/i);
            if (match) {
                deviceName = `iPad (iOS ${match[1]})`;
            }
        } else if (ua.includes('samsung')) {
            deviceName = 'Samsung Tablet';
            const model = ua.match(/sm-[tp][0-9]{3}/i);
            if (model) {
                deviceName = `Samsung ${model[0].toUpperCase()}`;
            }
        }
    }

    // Detect browser
    if (ua.includes('edg/')) {
        browser = 'Edge';
    } else if (ua.includes('opr/') || ua.includes('opera')) {
        browser = 'Opera';
    } else if (ua.includes('chrome')) {
        browser = 'Chrome';
    } else if (ua.includes('firefox')) {
        browser = 'Firefox';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
        browser = 'Safari';
    }

    // Detect OS
    if (ua.includes('windows')) {
        os = 'Windows';
        if (ua.includes('windows nt')) {
            const version = ua.match(/windows nt (\d+\.\d+)/i);
            if (version) {
                const versionMap: { [key: string]: string } = {
                    '10.0': '10/11',
                    '6.3': '8.1',
                    '6.2': '8',
                    '6.1': '7',
                    '6.0': 'Vista',
                    '5.2': 'XP x64',
                    '5.1': 'XP'
                };
                os = `Windows ${versionMap[version[1]] || version[1]}`;
            }
        }
    } else if (ua.includes('mac os') || ua.includes('macos')) {
        os = 'MacOS';
        const version = ua.match(/mac os x (\d+[._]\d+)/i);
        if (version) {
            os = `MacOS ${version[1].replace('_', '.')}`;
        }
    } else if (ua.includes('android')) {
        os = 'Android';
        const version = ua.match(/android (\d+(\.\d+)?)/i);
        if (version) {
            os = `Android ${version[1]}`;
        }
    } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
        os = 'iOS';
        const version = ua.match(/os (\d+_\d+)/i);
        if (version) {
            os = `iOS ${version[1].replace('_', '.')}`;
        }
    } else if (ua.includes('linux')) {
        os = 'Linux';
        if (ua.includes('ubuntu')) {
            os = 'Ubuntu';
        } else if (ua.includes('fedora')) {
            os = 'Fedora';
        }
    }

    return {
        deviceType,
        deviceName,
        browser,
        os
    };
}

// Helper function to format device info for logging
export function formatDeviceInfo(userAgent: string): string {
    const info = getDeviceInfo(userAgent);
    return `${info.deviceName} (${info.deviceType}) - ${info.browser} on ${info.os}`;
}

// Helper function to get full visitor info including IP
export interface VisitorInfo {
    ip: {
        forwardedFor: string;
        realIP: string;
        finalIP: string;
        isLocalhost: boolean;
    };
    device: DeviceInfo & {
        userAgent: string;
    };
}

export function getVisitorInfo(request: Request): VisitorInfo {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent") || "Unknown Device";

    const ip = forwardedFor
        ? forwardedFor.split(',')[0]
        : realIP || '127.0.0.1';

    return {
        ip: {
            forwardedFor: forwardedFor || 'none',
            realIP: realIP || 'none',
            finalIP: ip,
            isLocalhost: ip === '127.0.0.1' || ip === '::1'
        },
        device: {
            ...getDeviceInfo(userAgent),
            userAgent
        }
    };
}
