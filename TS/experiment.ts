import { Panels, Panel } from "./panels.ts";

const panels = new Panels();

document.body.append(panels);

const panel_hello_world: Panel = panels.new_panel();
panel_hello_world.content.textContent = "Hello, world!";

const panel_resizable: Panel = panels.new_panel({
	resizable: true,
	preservable: true,
	spawn_at_random: true,
	spawn_at_cursor: false,
});
const image = document.createElement("div");
image.classList.add("random-image");
panel_resizable.content.append(image);

const panel_3: Panel = panels.new_panel();
panel_3.grab.textContent = "Blade Runner 2049";
const grad = document.createElement("div");
grad.classList.add("gradient");
panel_3.content.append(grad);
