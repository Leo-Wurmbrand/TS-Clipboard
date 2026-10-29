/**
 * @file Functionality to use the computer's clipboard.
 *
 * @version 1.0.0
 *
 * @author Leo Wurmbrand <leo.wurmbrand@gmail.com>
 * @copyright Leo Wurmbrand 2024–2026
 * @license GPLv2
 */
/*
 * ******************************************
 * ! Clipboard functionality
 * ******************************************
 */
/**
 * Utility class to integrate with the computer's clipboard.
 *
 * @since 1.0.0
 *
 * @example Clipboard.copy("hello, world!");
 * @example Clipboard.copy("hello, world!", (text) => console.log("Copied text: ", text));
 * @example const text = await Clipboard.paste();
 * @example Clipboard.paste((text) => console.log(text));
 */
export default class Clipboard {
    /**
     * Constructor and executor for copying to clipboard.
     *
     * @param {...Props} args - The arguments (text: string, callback?: () => void).
     */
    constructor(...args) {
        if (!args[0])
            throw new Error('No text was provided to be copied');
        this.text = args[0];
        this.callback = args[1];
        this.handleCopy();
    }
    /**
     * Static alias for the constructor.
     *
     * @param {...Props} args - The arguments (text: string, callback?: () => void).
     */
    static copy(...args) {
        new Clipboard(...args);
    }
    /**
     * Reads text from the clipboard.
     *
     * @async
     * @param {CopyPasteCallback} [callback] - Executed with the clipboard text on success.
     * @returns {Promise<string | null>} The clipboard text, or null if reading failed.
     */
    static async paste(callback) {
        const text = await Clipboard.attemptPaste();
        if (text === null) {
            document.dispatchEvent(new CustomEvent('clipboardPaste__failure'));
            return null;
        }
        if (callback) {
            callback(text);
        }
        else {
            document.dispatchEvent(new CustomEvent('clipboardPaste__success', {
                detail: { text }
            }));
        }
        return text;
    }
    /**
 * Reads rich content from the clipboard.
 *
 * @async
 * @param {PasteItemsCallback} [callback] - Executed with the clipboard items on success.
 * @returns {Promise<ClipboardItem[] | null>} The clipboard items, or null if reading failed.
 */
    static async pasteItems(callback) {
        const items = await Clipboard.attemptPasteItems();
        if (items === null) {
            document.dispatchEvent(new CustomEvent('clipboardPasteItems__failure'));
            return null;
        }
        if (callback) {
            callback(items);
        }
        else {
            document.dispatchEvent(new CustomEvent('clipboardPasteItems__success', {
                detail: { items }
            }));
        }
        return items;
    }
    /**
     * Handles copying and executes the callback or triggers a document event.
     *
     * @async
     */
    async handleCopy() {
        const wasSuccess = await this.attemptCopy();
        if (wasSuccess) {
            if (this.callback) {
                this.callback(this.text);
            }
            else {
                const event = new CustomEvent('clipboardCopy__success', {
                    detail: {
                        text: this.text
                    }
                });
                document.dispatchEvent(event);
            }
        }
        else {
            const event = new CustomEvent('clipboardCopy__failure', {
                detail: {
                    text: this.text
                }
            });
            document.dispatchEvent(event);
        }
    }
    /**
     * Attempts various methods of copying the string.
     *
     * @async
     * @returns {Promise<boolean>} Whether text was copied to clipboard.
     */
    async attemptCopy() {
        if (!navigator.clipboard) {
            if (this.alternativeCopy())
                return true;
        }
        else {
            const worked = await this.navigatorCopy();
            if (worked)
                return true;
        }
        return false;
    }
    /**
     * Copies a string using an outdated API.
     *
     * @returns {boolean} Whether text was copied to clipboard.
     */
    alternativeCopy() {
        // Check if clipboard API is supported
        console.warn('Clipboard API may not be not supported.');
        // Attempt to copy by creating a textbox, selecting it, and copying
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = this.text;
        document.body.appendChild(tempTextArea);
        tempTextArea.focus({ preventScroll: true });
        tempTextArea.select();
        try {
            document.execCommand('copy');
            return true;
        }
        catch (error) {
            console.error('Could not copy text: ', error);
            return false;
        }
        finally {
            document.body.removeChild(tempTextArea);
        }
    }
    /**
     * Copies a string using the Navigator API.
     *
     * @async
     * @returns {Promise<boolean>} Whether text was copied to clipboard.
     */
    async navigatorCopy() {
        try {
            await navigator.clipboard.writeText(this.text);
            return true;
        }
        catch (error) {
            console.error('Could not copy text: ', error);
            return false;
        }
    }
    /**
     * Reads a string using the Navigator API.
     *
     * @async
     * @returns {Promise<string | null>} The clipboard text, or null if it couldn't be read.
     */
    static async attemptPaste() {
        if (!navigator.clipboard?.readText) {
            console.warn('Clipboard API does not support reading in this browser.');
            return null;
        }
        try {
            return await navigator.clipboard.readText();
        }
        catch (error) {
            console.error('Could not paste text: ', error);
            return null;
        }
    }
    /**
     * Reads clipboard items using the Navigator API.
     *
     * @async
     * @returns {Promise<ClipboardItem[] | null>} The clipboard items, or null if they couldn't be read.
     */
    static async attemptPasteItems() {
        if (!navigator.clipboard?.read) {
            console.warn('Clipboard API does not support reading items in this browser.');
            return null;
        }
        try {
            return await navigator.clipboard.read();
        }
        catch (error) {
            console.error('Could not paste items: ', error);
            return null;
        }
    }
}
