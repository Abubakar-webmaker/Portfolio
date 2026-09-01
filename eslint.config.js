export default [
    {
        files: ["script.js"],
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "no-console": "off"
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                navigator: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                requestAnimationFrame: "readonly",
                cancelAnimationFrame: "readonly",
                IntersectionObserver: "readonly",
                ResizeObserver: "readonly",
                gsap: "readonly",
                ScrollTrigger: "readonly"
            }
        }
    }
];
