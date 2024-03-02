# panels

panels module in TypeScript for easy window-style panels

##### Example

![Example](example.png)

##### Requirements

- `panels.scss`, `panels.ts` and `panels.png`

##### Usage

initialization

```typescript
import "../SCSS/panels.scss";
import { Panels, Panel } from "./panels.ts";

const panels = new Panels();
document.body.append(panels);
```

create a panel

```typescript
const panel_text: Panel = panels.new_panel();
panel_text.content.textContent = "Hello, world!";
```

create a resizable panel

```typescript
const panel_resizable: Panel = panels.new_panel({
	resizable: true,
	preservable: true,
	spawn_at_random: true,
	spawn_at_cursor: false,
});
panel_resizable.content.textContent = "Resizable panel!";
```
