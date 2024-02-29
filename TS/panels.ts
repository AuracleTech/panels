import "../SCSS/panels.scss";

class Panels extends HTMLElement {
	cursor_pos = { x: 0, y: 0 };
	panels: Panel[] = [];
	focused?: Panel;

	constructor() {
		super();

		this.classList.add("panels");
		this.id = `${Date.now()}${Math.random().toString(36).slice(2)}`;

		this.addEventListener(
			"mousemove",
			(ev) => (this.cursor_pos = { x: ev.clientX, y: ev.clientY })
		);
		this.addEventListener("contextmenu", (ev) => {
			ev.target === ev.currentTarget && this.set_focused();
		});
		this.addEventListener("pointerdown", (ev) => {
			ev.target === ev.currentTarget && this.set_focused();
		});
		const resizeObserver = new ResizeObserver(() => {
			this.panels.forEach((p) => p.reposition());
		});
		resizeObserver.observe(this);
	}

	new_panel(options?: PanelOptions): Panel {
		const panel = new Panel(this, options);
		this.panels.push(panel);
		this.append(panel);
		this.set_focused(panel);
		return panel;
	}

	set_focused(panel?: Panel) {
		this.panels = this.panels.filter((p) => p !== panel);
		if (panel) this.panels.push(panel);
		this.panels.forEach((p, i) => {
			p.classList.remove("focus");
			p.style.zIndex = i.toString();
		});
		this.focused = panel;
		if (this.focused) this.focused.classList.add("focus");
	}

	get_focused(): Panel | undefined {
		return this.focused;
	}

	close_panel(panel: Panel) {
		panel.remove();
		this.panels = this.panels.filter((p) => p !== panel);
		this.set_focused();
	}
}

interface PanelOptions {
	resizable: boolean;
	preservable: boolean;
	spawn_at_random: boolean;
	spawn_at_cursor: boolean;
}
class Panel extends HTMLElement {
	parent: Panels;
	options: PanelOptions = {
		resizable: false,
		preservable: false,
		spawn_at_random: true,
		spawn_at_cursor: false,
	};

	bar: HTMLDivElement = document.createElement("div");
	close: HTMLDivElement = document.createElement("div");
	grab: HTMLDivElement = document.createElement("div");
	flexible: HTMLDivElement = document.createElement("div");
	resize: HTMLDivElement = document.createElement("div");
	alternate: HTMLDivElement = document.createElement("div");
	squish: HTMLDivElement = document.createElement("div");
	content: HTMLDivElement = document.createElement("div");

	// NUKE not sure if we need this in the first place
	preserved?: {
		width: number;
		height: number;
		top: number;
		left: number;
	};
	squished?: {
		size: { width: number; height: number };
		pos: { top: number; left: number };
	};

	constructor(parent: Panels, options?: PanelOptions) {
		super();

		this.parent = parent;
		this.options = {
			...this.options,
			...options,
		};

		this.classList.add("panel");
		this.bar.classList.add("bar");
		this.close.classList.add("close", "option");
		this.grab.classList.add("grab");
		this.flexible.classList.add("flexible", "option");
		this.resize.classList.add("resize", "option");
		this.alternate.classList.add("alternate", "option");
		this.squish.classList.add("squish", "option");
		this.content.classList.add("content");

		this.bar.append(this.close, this.grab);
		if (this.options.resizable) this.bar.append(this.flexible);
		if (this.options.resizable) this.bar.append(this.resize);
		if (this.options.preservable) this.bar.append(this.alternate);
		this.bar.append(this.squish);
		this.append(this.bar, this.content);

		this.addEventListener("pointerdown", () => this.parent.set_focused(this));
		const resizeObserver = new ResizeObserver((entries) =>
			entries.forEach((entry) => {
				const panel = entry.target as Panel;
				this.reposition({ top: panel.offsetTop, left: panel.offsetLeft });
			})
		);
		resizeObserver.observe(this);
		this.close.addEventListener("pointerdown", (ev) => this.fclose(ev));
		this.grab.addEventListener("pointerdown", (ev) => this.fgrab(ev));
		if (this.options.resizable)
			this.grab.addEventListener("dblclick", () => this.maximize());
		else this.grab.addEventListener("dblclick", () => this.fsquish());
		this.flexible.addEventListener("pointerup", () => this.fflexible());
		this.resize.addEventListener("click", () => this.resizing());
		this.alternate.addEventListener("click", () => this.falternate());
		this.squish.addEventListener("click", () => this.fsquish());

		if (this.options.spawn_at_random)
			this.reposition({
				top: Math.round(
					Math.random() * (this.parent.clientHeight - this.clientHeight)
				),
				left: Math.round(
					Math.random() * (this.parent.clientWidth - this.clientWidth)
				),
			});
		else if (this.options.spawn_at_cursor)
			this.reposition({
				top: this.parent.cursor_pos.y,
				left: this.parent.cursor_pos.x,
			});
	}

	fclose(ev: MouseEvent) {
		ev.stopPropagation();
		if (ev.button !== 0) return;

		let allowed = false;
		this.close.classList.add("closing");

		const abort = () => {
			allowed = false;
			this.close.classList.remove("closing");
			this.close.removeEventListener("pointerup", abort);
			this.close.removeEventListener("pointerleave", abort);
			this.close.removeEventListener("transitionend", transitionend);
		};
		const poitnerup = (ev: PointerEvent) => {
			if (allowed) {
				if (ev.target === this.close) this.parent.close_panel(this);
			} else abort();
		};
		const transitionend = () => (allowed = true);
		this.close.addEventListener("pointerup", poitnerup, { once: true });
		this.close.addEventListener("pointerleave", abort, { once: true });
		this.close.addEventListener("transitionend", transitionend, { once: true });
	}

	fgrab(ev: PointerEvent) {
		const y = ev.clientY - this.offsetTop;
		const x = ev.clientX - this.offsetLeft;
		const pointermove = (ev: PointerEvent) =>
			this.reposition({
				top: ev.clientY - y,
				left: ev.clientX - x,
			});
		const pointerup = () => {
			this.parent.classList.remove("grabbing");
			removeEventListener("pointermove", pointermove);
		};
		this.parent.classList.add("grabbing");
		addEventListener("pointermove", pointermove);
		addEventListener("pointerup", pointerup, { once: true });
	}

	fflexible() {
		console.log("flexible");
		// remove width and height from style attribute
		this.style.width = "";
		this.style.height = "";
	}

	resizing() {
		this.parent.classList.add("resizing");

		const down = (ev: PointerEvent) => {
			const max_size = this.parent.getBoundingClientRect();
			const down_pos = this.resizing_clamp(ev, max_size);
			const move = (ev: PointerEvent) => {
				const move_pos = this.resizing_clamp(ev, max_size);
				let top = Math.min(move_pos.y, down_pos.y) - max_size.top;
				let left = Math.min(move_pos.x, down_pos.x) - max_size.left;
				let bottom = Math.max(move_pos.y, down_pos.y) - max_size.top;
				let right = Math.max(move_pos.x, down_pos.x) - max_size.left;

				const snap = 16;
				top = top < snap ? 0 : top;
				left = left < snap ? 0 : left;
				right = right > max_size.width - snap ? max_size.width : right;
				bottom = bottom > max_size.height - snap ? max_size.height : bottom;

				const width = right - left;
				const height = bottom - top;
				this.fresize({ width, height });
				this.reposition({ top, left });
			};
			const up = () => {
				this.parent.classList.remove("resizing");
				removeEventListener("pointermove", move);
			};
			addEventListener("pointermove", move);
			addEventListener("pointerup", up, { once: true });
		};
		addEventListener("pointerdown", down, { once: true });
	}

	resizing_clamp(ev: PointerEvent, max_size: DOMRect) {
		const x = Math.max(max_size.left, Math.min(ev.clientX, max_size.right));
		const y = Math.max(max_size.top, Math.min(ev.clientY, max_size.bottom));
		return { x, y };
	}

	falternate() {
		this.alternate.classList.toggle("restore");
		if (!this.preserved)
			this.preserved = {
				width: this.clientWidth,
				height: this.clientHeight,
				top: this.offsetTop,
				left: this.offsetLeft,
			};
		else {
			const { width, height, top, left } = this.preserved!;
			this.fresize({ width, height });
			this.reposition({ top, left });
			this.preserved = undefined;
		}
	}

	fsquish() {
		if (this.squished) {
			if (this.options.resizable) this.fresize(this.squished.size);
			else this.reposition(this.squished.pos);
			this.squished = undefined;
		} else {
			this.squished = {
				size: {
					width: this.clientWidth,
					height: this.clientHeight,
				},
				pos: {
					top: this.offsetTop,
					left: this.offsetLeft,
				},
			};
			this.fresize();
		}
		this.classList.toggle("squished");
	}

	maximize() {
		if (
			this.clientWidth === this.parent.clientWidth &&
			this.clientHeight === this.parent.clientHeight
		)
			this.fresize();
		else
			this.fresize({
				width: this.parent.clientWidth,
				height: this.parent.clientHeight,
			});
	}

	reposition(positions?: { top: number; left: number }) {
		if (!positions) positions = { top: this.offsetTop, left: this.offsetLeft };
		let { top, left } = positions;
		top = Math.max(
			0,
			Math.min(top, this.parent.clientHeight - this.clientHeight)
		);
		left = Math.max(
			0,
			Math.min(left, this.parent.clientWidth - this.clientWidth)
		);
		this.style.top = `${top}px`;
		this.style.left = `${left}px`;
		this.dispatchEvent(
			new CustomEvent("reposition", { detail: { top, left } })
		);
	}

	fresize(size?: { width?: number; height?: number }) {
		const { width, height } = size || {};
		this.style.width = width !== null ? `${width}px` : "";
		this.style.height = height !== null ? `${height}px` : "";
		this.dispatchEvent(
			new CustomEvent("resize", { detail: { width, height } })
		);
	}
}
customElements.define("custom-panel", Panel);
customElements.define("custom-panels", Panels);

export { Panels, Panel };
