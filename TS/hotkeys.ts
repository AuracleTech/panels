interface Hotkey {
	key: string;
	short: string;
	long: string;
	func: () => void;
	experimental: boolean;
}

class Hotkeys {
	static KEYBOARD_KEYS: string[][] = [
		[
			"esc",
			"f1",
			"f2",
			"f3",
			"f4",
			"f5",
			"f6",
			"f7",
			"f8",
			"f9",
			"f10",
			"f11",
			"f12",
		],
		["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "back"],
		["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
		["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"],
		["l shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "r shift"],
		["l ctrl", "cmd", "l alt", "space", "r alt", "r ctrl"],
	];

	private keys_dom: { [key: string]: HTMLDivElement } = {};
	hotkeys: { [key: string]: Hotkey } = {};

	private modal: HTMLDivElement;
	private feedback: HTMLDivElement;

	private keyboard: HTMLDivElement;

	constructor() {
		this.modal = document.createElement("div");
		this.modal.id = "modal";
		this.modal.classList.add("display-none");

		this.keyboard = document.createElement("div");
		this.keyboard.id = "keyboard";
		this.modal.append(this.keyboard);

		this.feedback = document.createElement("div");
		this.feedback.id = "hotkeys_feedback";
		this.feedback.classList.add("display-none");

		document.body.append(this.modal, this.feedback);

		for (const row of Hotkeys.KEYBOARD_KEYS) {
			const row_div: HTMLDivElement = document.createElement("div");
			row_div.classList.add("row");
			this.keyboard.append(row_div);
			for (const column of row) {
				const key_div: HTMLDivElement = document.createElement("div");
				key_div.classList.add("key");
				key_div.textContent = column;
				row_div.append(key_div);
				this.keys_dom[column] = key_div;
				if (
					column == ("back" || "tab" || "enter" || "caps" || "shift" || "ctrl")
				)
					key_div.classList.add("large");
				else if (column == "space") key_div.classList.add("space");
			}
		}

		addEventListener("keydown", this.keydown);
		addEventListener("paste", () => {
			if (this.hotkeys["paste"]) this.hotkeys["paste"].func();
		});
		this.modal.addEventListener(
			"click",
			(ev) => ev.target == this.modal && this.toggle_modal()
		);
	}

	public set(hotkey: Hotkey): void {
		if (this.hotkeys[hotkey.key]) {
			console.warn(`Hotkey ignored, hotkey '${hotkey.key}' already exists`);
		} else {
			this.hotkeys[hotkey.key] = hotkey;
			let pophover = document.createElement("div");
			pophover.classList.add("pophover");
			pophover.textContent = hotkey.long;
			if (hotkey.experimental) {
				const experimental: HTMLSpanElement = document.createElement("span");
				experimental.classList.add("experimental_icon");
				experimental.innerText = "Experimental 🧪";
				pophover.append(experimental);
				this.keys_dom[hotkey.key].classList.add("experimental");
			}
			this.keys_dom[hotkey.key].append(pophover);
			this.keys_dom[hotkey.key].classList.add("used");
		}
	}

	public remove(key: string): void {
		delete this.hotkeys[key];
		this.keys_dom[key].classList.remove("used", "experimental");
		this.keys_dom[key].textContent = key;
	}

	private keydown = (ev: KeyboardEvent): void => {
		if (
			document.activeElement instanceof HTMLInputElement ||
			document.activeElement instanceof HTMLTextAreaElement ||
			(document.activeElement as Element & { isContentEditable: boolean })
				.isContentEditable
		)
			return;

		let key: string = ev.key.toLowerCase();

		// TODO implement combos / special keys
		// const SHIFT: boolean = ev.shiftKey;
		// const CTRL: boolean = ev.ctrlKey;
		// const ALT: boolean = ev.altKey;
		// const META: boolean = ev.metaKey;

		switch (key) {
			case "control":
				key = `${ev.location == 1 ? "l" : "r"} ctrl`;
				break;
			case "shift":
				key = `${ev.location == 1 ? "l" : "r"} shift`;
				break;
			case "meta":
				key = "cmd";
				break;
			case " ":
				key = "space";
				break;
			case "capslock":
				key = "caps";
				break;
			case "escape":
				key = "esc";
				break;
			case "alt":
				key = `${ev.location == 1 ? "l" : "r"} alt`;
				break;
			case "backspace":
				key = "back";
				break;
		}

		if (!this.keys_dom[key]) return;
		if (!this.hotkeys[key]) return;

		ev.preventDefault();

		let hotkey = this.hotkeys[key];

		this.feedback.classList.remove("keypress");
		this.feedback.classList.remove("display-none");
		void this.feedback.offsetWidth;
		this.feedback.classList.add("keypress");
		const feedback_text = hotkey.short + (hotkey.experimental ? " 🧪" : "");
		this.feedback.textContent = feedback_text;

		this.hotkeys[hotkey.key].func();
	};

	toggle_modal(): void {
		this.modal.classList.toggle("display-none");
	}
}

export { Hotkeys };
