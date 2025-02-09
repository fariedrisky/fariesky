// utils/deviceDetection.ts

export interface DeviceInfo {
    deviceType: string;
    deviceName: string;
    deviceBrand: string;
    deviceModel: string;
    browser: string;
    os: string;
}

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

export function getDeviceInfo(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase();

    let deviceType = 'Desktop';
    let deviceName = 'Unknown Device';
    let deviceBrand = 'Unknown Brand';
    let deviceModel = 'Unknown Model';
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    // Detect device type and brand/model
    if (ua.includes('mobile')) {
        deviceType = 'Mobile';

        // Mobile detection logic
        if (ua.includes('samsung')) {
            deviceBrand = 'Samsung';
            if (ua.includes('sm-a')) {
                deviceName = 'Samsung Galaxy A Series';
                const model = ua.match(/sm-a\d{3}/i);
                if (model) {
                    deviceName = `Samsung ${model[0].toUpperCase()}`;
                    deviceModel = model[0].toUpperCase();
                }
            } else if (ua.includes('sm-s')) {
                deviceName = 'Samsung Galaxy S Series';
                const model = ua.match(/sm-s\d{3}/i);
                if (model) {
                    deviceName = `Samsung ${model[0].toUpperCase()}`;
                    deviceModel = model[0].toUpperCase();
                }
            }
        } else if (ua.includes('iphone')) {
            deviceBrand = 'Apple';
            deviceName = 'iPhone';
            const match = ua.match(/iphone\s*(?:os\s*)?(\d+)/i);
            if (match) {
                deviceName = `iPhone (iOS ${match[1]})`;
                deviceModel = `iPhone iOS ${match[1]}`;
            }
        } else if (ua.includes('xiaomi')) {
            deviceBrand = 'Xiaomi';
            deviceName = 'Xiaomi Phone';
            const model = ua.match(/redmi\s([a-z0-9]+)/i) || ua.match(/mi\s([a-z0-9]+)/i);
            if (model) {
                deviceName = `Xiaomi ${model[0]}`;
                deviceModel = model[0];
            }
        } else if (ua.includes('oppo')) {
            deviceBrand = 'OPPO';
            deviceName = 'OPPO Phone';
            const model = ua.match(/(?:oppo\s)?([a-z][0-9]+[a-z]?)/i);
            if (model) {
                deviceName = `OPPO ${model[0].toUpperCase()}`;
                deviceModel = model[0].toUpperCase();
            }
        } else if (ua.includes('vivo')) {
            deviceBrand = 'Vivo';
            deviceName = 'Vivo Phone';
            const model = ua.match(/vivo\s([a-z0-9]+)/i);
            if (model) {
                deviceName = `Vivo ${model[0]}`;
                deviceModel = model[0];
            }
        }
    } else if (ua.includes('tablet')) {
        deviceType = 'Tablet';
        if (ua.includes('ipad')) {
            deviceBrand = 'Apple';
            deviceName = 'iPad';
            const match = ua.match(/ipad\s*(?:os\s*)?(\d+)/i);
            if (match) {
                deviceName = `iPad (iOS ${match[1]})`;
                deviceModel = `iPad iOS ${match[1]}`;
            }
        } else if (ua.includes('samsung')) {
            deviceBrand = 'Samsung';
            deviceName = 'Samsung Tablet';
            const model = ua.match(/sm-[tp][0-9]{3}/i);
            if (model) {
                deviceName = `Samsung ${model[0].toUpperCase()}`;
                deviceModel = model[0].toUpperCase();
            }
        }
    } else {
        // Enhanced Desktop/Laptop detection
        deviceType = 'Desktop/Laptop';

        // Detect laptop brands and models
        if (ua.includes('lenovo')) {
            deviceBrand = 'Lenovo';
            // ThinkPad detection
            if (ua.includes('thinkpad')) {
                const model = ua.match(/thinkpad\s+([a-z][0-9]+[a-z]?)/i);
                if (model) {
                    deviceModel = `ThinkPad ${model[1].toUpperCase()}`;
                    deviceName = `Lenovo ${deviceModel}`;
                } else {
                    deviceName = 'Lenovo ThinkPad';
                    deviceModel = 'ThinkPad';
                }
            }
            // IdeaPad detection
            else if (ua.includes('ideapad')) {
                const model = ua.match(/ideapad\s+([a-z0-9]+)/i);
                if (model) {
                    deviceModel = `IdeaPad ${model[1]}`;
                    deviceName = `Lenovo ${deviceModel}`;
                } else {
                    deviceName = 'Lenovo IdeaPad';
                    deviceModel = 'IdeaPad';
                }
            }
            // Legion detection
            else if (ua.includes('legion')) {
                const model = ua.match(/legion\s+([a-z0-9]+)/i);
                if (model) {
                    deviceModel = `Legion ${model[1]}`;
                    deviceName = `Lenovo ${deviceModel}`;
                } else {
                    deviceName = 'Lenovo Legion';
                    deviceModel = 'Legion';
                }
            }
        }
        // Dell detection
        else if (ua.includes('dell')) {
            deviceBrand = 'Dell';
            // XPS detection
            if (ua.includes('xps')) {
                const model = ua.match(/xps\s*(\d+)/i);
                if (model) {
                    deviceModel = `XPS ${model[1]}`;
                    deviceName = `Dell ${deviceModel}`;
                } else {
                    deviceName = 'Dell XPS';
                    deviceModel = 'XPS';
                }
            }
            // Latitude detection
            else if (ua.includes('latitude')) {
                const model = ua.match(/latitude\s*([a-z0-9]+)/i);
                if (model) {
                    deviceModel = `Latitude ${model[1]}`;
                    deviceName = `Dell ${deviceModel}`;
                } else {
                    deviceName = 'Dell Latitude';
                    deviceModel = 'Latitude';
                }
            }
            // Inspiron detection
            else if (ua.includes('inspiron')) {
                const model = ua.match(/inspiron\s*(\d+)/i);
                if (model) {
                    deviceModel = `Inspiron ${model[1]}`;
                    deviceName = `Dell ${deviceModel}`;
                } else {
                    deviceName = 'Dell Inspiron';
                    deviceModel = 'Inspiron';
                }
            }
        }
        // HP detection
        else if (ua.includes('hp') || ua.includes('hewlett-packard')) {
            deviceBrand = 'HP';
            // Pavilion detection
            if (ua.includes('pavilion')) {
                const model = ua.match(/pavilion\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `Pavilion ${model[1]}`;
                    deviceName = `HP ${deviceModel}`;
                } else {
                    deviceName = 'HP Pavilion';
                    deviceModel = 'Pavilion';
                }
            }
            // Envy detection
            else if (ua.includes('envy')) {
                const model = ua.match(/envy\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `Envy ${model[1]}`;
                    deviceName = `HP ${deviceModel}`;
                } else {
                    deviceName = 'HP Envy';
                    deviceModel = 'Envy';
                }
            }
            // EliteBook detection
            else if (ua.includes('elitebook')) {
                const model = ua.match(/elitebook\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `EliteBook ${model[1]}`;
                    deviceName = `HP ${deviceModel}`;
                } else {
                    deviceName = 'HP EliteBook';
                    deviceModel = 'EliteBook';
                }
            }
        }
        // ASUS detection
        else if (ua.includes('asus')) {
            deviceBrand = 'ASUS';
            // ROG detection
            if (ua.includes('rog')) {
                const model = ua.match(/rog\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `ROG ${model[1]}`;
                    deviceName = `ASUS ${deviceModel}`;
                } else {
                    deviceName = 'ASUS ROG';
                    deviceModel = 'ROG';
                }
            }
            // ZenBook detection
            else if (ua.includes('zenbook')) {
                const model = ua.match(/zenbook\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `ZenBook ${model[1]}`;
                    deviceName = `ASUS ${deviceModel}`;
                } else {
                    deviceName = 'ASUS ZenBook';
                    deviceModel = 'ZenBook';
                }
            }
            // VivoBook detection
            else if (ua.includes('vivobook')) {
                const model = ua.match(/vivobook\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `VivoBook ${model[1]}`;
                    deviceName = `ASUS ${deviceModel}`;
                } else {
                    deviceName = 'ASUS VivoBook';
                    deviceModel = 'VivoBook';
                }
            }
        }
        // Acer detection
        else if (ua.includes('acer')) {
            deviceBrand = 'Acer';
            // Predator detection
            if (ua.includes('predator')) {
                const model = ua.match(/predator\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `Predator ${model[1]}`;
                    deviceName = `Acer ${deviceModel}`;
                } else {
                    deviceName = 'Acer Predator';
                    deviceModel = 'Predator';
                }
            }
            // Aspire detection
            else if (ua.includes('aspire')) {
                const model = ua.match(/aspire\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `Aspire ${model[1]}`;
                    deviceName = `Acer ${deviceModel}`;
                } else {
                    deviceName = 'Acer Aspire';
                    deviceModel = 'Aspire';
                }
            }
            // Swift detection
            else if (ua.includes('swift')) {
                const model = ua.match(/swift\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `Swift ${model[1]}`;
                    deviceName = `Acer ${deviceModel}`;
                } else {
                    deviceName = 'Acer Swift';
                    deviceModel = 'Swift';
                }
            }
        }
        // MSI detection
        else if (ua.includes('msi')) {
            deviceBrand = 'MSI';
            // Gaming series detection
            if (ua.includes('gaming')) {
                const model = ua.match(/gaming\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `Gaming ${model[1]}`;
                    deviceName = `MSI ${deviceModel}`;
                } else {
                    deviceName = 'MSI Gaming';
                    deviceModel = 'Gaming Series';
                }
            }
            // Creator series detection
            else if (ua.includes('creator')) {
                const model = ua.match(/creator\s*([a-z0-9-]+)/i);
                if (model) {
                    deviceModel = `Creator ${model[1]}`;
                    deviceName = `MSI ${deviceModel}`;
                } else {
                    deviceName = 'MSI Creator';
                    deviceModel = 'Creator Series';
                }
            }
        }
        // Apple Mac detection
        else if (ua.includes('macintosh')) {
            deviceBrand = 'Apple';
            if (ua.includes('macbook pro')) {
                deviceModel = 'MacBook Pro';
                deviceName = 'Apple MacBook Pro';
            } else if (ua.includes('macbook air')) {
                deviceModel = 'MacBook Air';
                deviceName = 'Apple MacBook Air';
            } else if (ua.includes('imac')) {
                deviceModel = 'iMac';
                deviceName = 'Apple iMac';
            } else if (ua.includes('mac mini')) {
                deviceModel = 'Mac Mini';
                deviceName = 'Apple Mac Mini';
            } else if (ua.includes('mac pro')) {
                deviceModel = 'Mac Pro';
                deviceName = 'Apple Mac Pro';
            }
        }
    }

    // Browser detection
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
    } else if (ua.includes('brave')) {
        browser = 'Brave';
    }

    // OS detection
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
        } else if (ua.includes('debian')) {
            os = 'Debian';
        } else if (ua.includes('mint')) {
            os = 'Linux Mint';
        } else if (ua.includes('arch')) {
            os = 'Arch Linux';
        }
    }

    return {
        deviceType,
        deviceName,
        deviceBrand,
        deviceModel,
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

// Example usage in your API route:
/*
import { getVisitorInfo } from '@/utils/deviceDetection';

export async function POST(request: NextRequest) {
    try {
        const visitorInfo = getVisitorInfo(request);
        console.log('Visitor Details:', visitorInfo);
        
        // Your existing code...
        
    } catch (error) {
        console.error('Error:', error);
    }
}
*/
