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
image.style.backgroundImage =
	"url('https://source.unsplash.com/random/300x300')";
image.style.width = "300px";
image.style.height = "300px";
panel_resizable.content.append(image);

const panel_3: Panel = panels.new_panel();
panel_3.grab.textContent = "Blade Runner 2049";
const grad = document.createElement("div");
grad.style.backgroundImage = "linear-gradient(45deg, #1edead 0%, #00aced 100%)";
grad.style.width = "420px";
grad.style.height = "180px";
panel_3.content.append(grad);
