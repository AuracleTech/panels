import "../SCSS/panels.scss";
import { Panels, Panel } from "./panels.ts";

const panels = new Panels();
document.body.append(panels);

const panel_text: Panel = panels.new_panel();
const text = document.createElement("div");
text.classList.add("text");
text.textContent = "Hello, world!";
panel_text.content.append(text);

const panel_image: Panel = panels.new_panel({
	resizable: true,
	preservable: true,
	spawn_at_random: true,
	spawn_at_cursor: false,
});
const image = document.createElement("div");
image.classList.add("random-image");
panel_image.content.append(image);

const panel_icons: Panel = panels.new_panel();
const icons = document.createElement("div");
icons.classList.add("icons");
panel_icons.content.append(icons);
