export const fonts = [
    {
        family: "LibreBaskerville",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/LibreBaskerville-Regular.ttf`,
        fontWeight: 400,
        fontStyle: "normal",
    },
    {
        family: "LibreBaskerville",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/LibreBaskerville-Bold.ttf`,
        fontWeight: 700,
        fontStyle: "bold",
    },
    {
        family: "LibreBaskerville",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/LibreBaskerville-Italic.ttf`,
        fontWeight: 400,
        fontStyle: "italic",
    },
] as const;
