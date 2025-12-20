/**
 * Displays a friendly message in the DevTools console.
 * Non-blocking, production-only (or always if desired, but request said production only).
 */
export const initDevToolsNotice = () => {
    // Check if production or just run it. User said "On app load (production only)".
    // Vite uses import.meta.env.PROD
    if (import.meta.env.PROD) {
        const style = [
            'font-size: 14px',
            'font-family: monospace',
            'background: #0b0c10',
            'color: #66fcf1',
            'padding: 10px 20px',
            'border: 1px solid #45a29e',
            'border-radius: 5px',
            'line-height: 1.5'
        ].join(';');

        console.log(
            '%c👋 Hey there! If you’re looking at the code, functionality is best viewed on GitHub.\nFeel free to reach out to me!\n\nhttps://github.com/SohamBasanwar',
            style
        );
    }
};
