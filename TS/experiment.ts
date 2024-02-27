import { Panels, Panel } from "./panels.ts";

document.documentElement.style.height = "100%";
document.documentElement.style.width = "100%";
document.body.style.height = "100%";
document.body.style.width = "100%";
document.body.style.margin = "0";
document.body.style.backgroundImage =
	"linear-gradient(45deg, #ac00ed 0%, #00aced 100%)";

const limiter = document.createElement("div");
limiter.style.position = "fixed";
limiter.style.width = "85%";
limiter.style.height = "85%";
limiter.style.left = "50%";
limiter.style.top = "50%";
limiter.style.transform = "translate(-50%, -50%)";
limiter.style.boxShadow = "0 0 200px 2px #00aced";
limiter.style.borderRadius = "3px";
limiter.style.overflow = "hidden";
limiter.style.backgroundColor = "#04040E";
document.body.append(limiter);

const panels = new Panels();
limiter.append(panels);

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
const grad = document.createElement("div");
grad.style.backgroundImage = "linear-gradient(45deg, #1edead 0%, #00aced 100%)";
grad.style.width = "420px";
grad.style.height = "180px";
panel_3.content.append(grad);
