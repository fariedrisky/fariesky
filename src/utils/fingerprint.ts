// utils/fingerprint.ts

// Type definitions
interface NavigatorExtended extends Navigator {
    deviceMemory?: number;
    connection?: {
        type?: string;
    };
}

interface WebGLDebugExtension {
    UNMASKED_RENDERER_WEBGL: number;
}

export const getDeviceFingerprint = async (): Promise<string> => {
    if (typeof window === 'undefined') return '';

    const getCanvasFingerprint = (): string => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        // Text with different styles
        canvas.width = 200;
        canvas.height = 50;

        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);

        ctx.fillStyle = "#069";
        ctx.fillText("Fingerprint", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Fingerprint", 4, 17);

        return canvas.toDataURL();
    };

    const getInstalledFonts = (): string[] => {
        const fontList = [
            'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana',
            'Helvetica', 'Impact', 'Comic Sans MS', 'Tahoma', 'Trebuchet MS'
        ];

        return fontList.filter(font => {
            const testString = 'mmmmmmmmmmlli';
            const testSize = '72px';
            const baseWidth = getTextWidth(testString, `${testSize} serif`);
            const testWidth = getTextWidth(testString, `${testSize} ${font}, serif`);
            return baseWidth !== testWidth;
        });
    };

    const getTextWidth = (text: string, font: string): number => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 0;
        ctx.font = font;
        return ctx.measureText(text).width;
    };

    const getGPUInfo = (): string => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
        if (!gl) return '';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as WebGLDebugExtension | null;
        if (!debugInfo) return '';

        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return renderer ? renderer.toString() : '';
    };

    const checkAudioSupport = (): boolean => {
        if (typeof window === 'undefined') return false;

        // Check for standard AudioContext
        if ('AudioContext' in window) return true;

        // Check for webkit prefix
        if ('webkitAudioContext' in window) return true;

        return false;
    };

    const nav = navigator as NavigatorExtended;

    const components = {
        // System info
        platform: window.navigator.platform,
        userAgent: window.navigator.userAgent,
        cpuCores: window.navigator.hardwareConcurrency,
        deviceMemory: nav.deviceMemory,

        // Screen properties
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,

        // Browser capabilities
        languages: window.navigator.languages,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        touchPoints: window.navigator.maxTouchPoints,

        // Hardware acceleration
        gpuInfo: getGPUInfo(),

        // Canvas fingerprint
        canvasFingerprint: getCanvasFingerprint(),

        // Installed fonts
        installedFonts: getInstalledFonts(),

        // Audio context
        audioContext: checkAudioSupport(),

        // Connection info
        connectionType: nav.connection?.type,

        // Additional browser features
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        plugins: Array.from(navigator.plugins).map(p => p.name),
    };

    // Create hash from all components
    const str = JSON.stringify(components);
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
};
