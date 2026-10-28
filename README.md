# TS Clipboard
TypeScript utility function to copy text to clipboard.

## Example usage

```ts
import Clipboard from './Clipboard';

// (Default) 5 characters
Clipboard.copy("hello, world!");
```

## Documentation

### `Clipboard.copy(text, callback?)`

Static method to copy a string.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `string` | `string` | none | String to copy to clipboard. |
| `callback` | `() => void` | `undefined` | An optional callback to execute after successful copying. |

## Events

The clipboard instance also defines two document events:

- `clipboardCopy__success`, after copying succeeded.
- `clipboardCopy__failure`, after copying failed.

Both include information on the text that was or failed to copy and can be hooked into like so:

```ts
document.addEventListener('clipboardCopy__failure', (e: Event) => {
  const { text } = (e as CustomEvent<{ text: string }>).detail;
  console.warn('Copy failed for:', text);
});
```

Any error is logged in the console.

## License

GPLv2 © Leo Wurmbrand 2025–2026