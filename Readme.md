# use-why-effect-ran

A lightweight React debugging hook that tells you **which dependency caused a component's `useEffect` to re-run**.

Useful when tracking down unnecessary renders, unstable references, or unexpected effect executions.

## Features

- 🔍 Shows exactly which dependency changed
- 📊 Logs previous and current values
- ⚛️ Works with any React hook dependency array
- 🪶 Zero runtime dependencies
- 📦 TypeScript support included
- 🌳 Tree-shakeable

---

## Installation

```bash
npm install @krsamir/use-why-effect-ran
```

```bash
yarn add @krsamir/use-why-effect-ran
```

---

## Usage

### Basic Example

```tsx
import { useEffect, useState } from "react";
import { useWhyEffectRan } from "@krsamir/use-why-effect-ran";

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Samir");

  useWhyEffectRan([count, name], ["count", "name"]);

  useEffect(() => {
    console.log("Effect executed");
  }, [count, name]);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>

      <button onClick={() => setName("John")}>Change Name</button>
    </>
  );
}
```

---

## Console Output

When `count` changes:

```txt
useEffect re-ran because:

┌─────────┬──────┬────┐
│ (index) │ from │ to │
├─────────┼──────┼────┤
│ count   │  1   │ 2  │
└─────────┴──────┴────┘
```

When multiple dependencies change:

```txt
useEffect re-ran because:

┌─────────┬────────┬────────┐
│ (index) │ from   │ to     │
├─────────┼────────┼────────┤
│ count   │ 1      │ 2      │
│ name    │ Samir  │ John   │
└─────────┴────────┴────────┘
```

---

## API

### `useWhyEffectRan`

```ts
useWhyEffectRan(
  dependencies: DependencyList,
  dependencyNames?: readonly string[]
): void;
```

#### Parameters

| Parameter         | Type                | Description                                       |
| ----------------- | ------------------- | ------------------------------------------------- |
| `dependencies`    | `DependencyList`    | The dependency array you want to inspect          |
| `dependencyNames` | `readonly string[]` | Optional human-readable names for each dependency |

---

## Example with Objects

```tsx
const filters = {
  status: "ACTIVE",
};

useWhyEffectRan([filters], ["filters"]);

useEffect(() => {
  fetchData(filters);
}, [filters]);
```

Console output:

```txt
useEffect re-ran because:

filters:
  from: { status: "ACTIVE" }
  to:   { status: "ACTIVE" }
```

This often indicates a new object reference is being created on each render.

---

## Example with Functions

```tsx
const handleSubmit = () => {
  // submit logic
};

useWhyEffectRan([handleSubmit], ["handleSubmit"]);
```

If the function is recreated every render, the hook will show it as changed.

Consider using:

```tsx
const handleSubmit = useCallback(() => {
  // submit logic
}, []);
```

---

## Why Use This?

A common situation:

```tsx
useEffect(() => {
  fetchData();
}, [filters, sortBy, page]);
```

The effect keeps running, but it's unclear which dependency changed.

With:

```tsx
useWhyEffectRan([filters, sortBy, page], ["filters", "sortBy", "page"]);
```

you can immediately see what triggered the effect.

---

## TypeScript Support

This package ships with built-in TypeScript definitions.

```ts
import { useWhyEffectRan } from "@krsamir/use-why-effect-ran";
```

No additional type packages are required.

---

## Requirements

| Package | Version |
| ------- | ------- |
| React   | >= 18   |

---

## Notes

- Intended for debugging and development workflows.
- Uses `Object.is()` for dependency comparison, matching React's dependency checking behavior.
- Logs changes using `console.group()` and `console.table()`.

---

## License

MIT

---

## Author

**Samir Kumar**

GitHub: https://github.com/krsamir
