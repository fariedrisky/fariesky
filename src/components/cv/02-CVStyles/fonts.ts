export const fonts = [
    {
        family: "Georgia",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/Georgia-Regular.ttf`,
        fontWeight: 400,
        fontStyle: "normal",
    },
    {
        family: "Georgia",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/Georgia-Bold.ttf`,
        fontWeight: 700,
        fontStyle: "bold",
    },
    {
        family: "Georgia",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/Georgia-Italic.ttf`,
        fontWeight: 400,
        fontStyle: "italic",
    },
] as const;
