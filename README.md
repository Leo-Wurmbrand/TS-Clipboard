# TS Clipboard
TypeScript utility function to copy text to clipboard.

## Example usage

```ts
import Clipboard from './Clipboard';

// Copy text
Clipboard.copy("hello, world!");

// Copy text and log success in console
Clipboard.copy("hello, world!", (text) => console.log("Copied text: ", text));

// Paste text
const text = await Clipboard.paste();

// Paste text and log in console
Clipboard.paste((text) => console.log(text));

// Paste rich formatted items and log them in the console
Clipboard.pasteItems((items) => console.log(items));
```

## Documentation

### `Clipboard.copy(text, callback?)`

Static method to copy a string.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `string` | `string` | none | String to copy to clipboard. |
| `callback` | `(text: string) => void` | `undefined` | An optional callback to execute after successful copying. |

### `Clipboard.paste(callback?): Promise<string | null>`

Static async method to read text from the clipboard. 

Note: The browser likely requires HTTPS or localhost and may ask for user verification. This method hould be called from a user gesture (e.g.: click handler). 

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `callback` | `(text: string) => void` | `undefined` | An optional callback to execute after successful pasting. |

Returns `Promise<string | null>` (the clipboard's text, or `null` on failure). Note an empty clipboard or non-text content returns `''`.

### `Clipboard.pasteItems(callback?): Promise<ClipboardItem[] | null>`

Static async method to read rich content (e.g.: text, HTML, images, etc.) from the clipboard as `ClipboardItem`s.

Note: The browser likely requires HTTPS or localhost and may ask for user verification. This method hould be called from a user gesture (e.g.: click handler). 

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `callback` | `(items: ClipboardItem[]) => void` | `undefined` | An optional callback to execute after successful pasting. |

Returns `Promise<ClipboardItem[] | null>` (the clipboard's items, or `null` on failure). Note an empty clipboard returns `[]`.

## Events

The clipboard instance also defines two document events:

- `clipboardCopy__success`, `clipboardPaste__success`, and `clipboardPasteItems__success` after succeeding.
- `clipboardCopy__failure`, `clipboardPaste__failure`, and `clipboardPasteItems__failure` after failing.

Copy events always include the text that was copied or failed to copy.
Paste events only include data on success.
Text data is found under `event.detail.text` and rich content under `event.detail`.

```ts
document.addEventListener('clipboardCopy__failure', (event: Event) => {
  const { text } = (event as CustomEvent<{ text: string }>).detail;
  console.warn('Copy failed for:', text);
});

document.addEventListener('clipboardPaste__success', (event: Event) => {
  const { text } = (event as CustomEvent<{ text: string }>).detail;
  console.warn('Document pasted:', text);
});

document.addEventListener('clipboardPasteItems__failure', () => {
  console.warn('Pasting failed. Nothing to display.');
});
```

Any error is logged in the console.

## License

GPLv2 © Leo Wurmbrand 2024–2026