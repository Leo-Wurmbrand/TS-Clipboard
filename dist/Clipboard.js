/**
 * @file Functionality to use the computer's clipboard.
 *
 * @version 0.0.1
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
 * @since 0.0.1
 *
 * @example Clipboard.copy("hello, world!");
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
     * Handles copying and executes the callback or triggers a document event.
     *
     * @async
     */
    async handleCopy() {
        const wasSuccess = await this.attemptCopy();
        if (wasSuccess) {
            if (this.callback) {
                this.callback();
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
        console.warn('Clipboard API may not be not supported');
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
}
