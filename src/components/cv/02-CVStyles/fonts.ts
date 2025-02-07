export const fonts = [
    {
        family: "Georgia",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/georgia.ttf`,
        fontWeight: 400,
        fontStyle: "normal",
    },
    {
        family: "Georgia",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/georgiab.ttf`,
        fontWeight: 700,
        fontStyle: "bold",
    },
    {
        family: "Georgia",
        format: "truetype",
        src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/georgiai.ttf`,
        fontWeight: 400,
        fontStyle: "italic",
    },
];
