import { Panels, Panel } from "./panels.ts";

const panels = new Panels();
document.body.append(panels);

const panel_text: Panel = panels.new_panel();
panel_text.content.textContent = "Hello, world!";

const panel_image: Panel = panels.new_panel({
	resizable: true,
	preservable: true,
	spawn_at_random: true,
	spawn_at_cursor: false,
});
const image = document.createElement("div");
image.classList.add("random-image");
panel_image.content.append(image);

const panel_gradient: Panel = panels.new_panel();
panel_gradient.grab.textContent = "Blade Runner 2049";
const gradient = document.createElement("div");
gradient.classList.add("gradient");
panel_gradient.content.append(gradient);
