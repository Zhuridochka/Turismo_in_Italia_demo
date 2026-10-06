//#region src/components/custom/breadcrumbs/breadcrumbs.js
function initAdaptiveBreadcrumbs() {
	const BREAKPOINT = 1260;
	document.querySelectorAll(".breadcrumbs").forEach((bc) => {
		const list = bc.querySelector(".breadcrumbs__list");
		if (!list) return;
		let dotsItem = list.querySelector(".breadcrumbs__dots-item");
		if (!dotsItem) {
			dotsItem = document.createElement("li");
			dotsItem.className = "breadcrumbs__item breadcrumbs__dots-item";
			dotsItem.innerHTML = `<span class="breadcrumbs__dots" aria-hidden="true"></span>`;
			list.insertBefore(dotsItem, list.children[1]);
		}
		const update = () => {
			const items = Array.from(list.children);
			if (window.innerWidth > BREAKPOINT) {
				items.forEach((li) => li.style.display = "flex");
				dotsItem.style.display = "none";
				return;
			}
			items.forEach((li) => li.style.display = "flex");
			dotsItem.style.display = "none";
			const listWidth = list.offsetWidth;
			if (items.reduce((sum, li) => sum + li.offsetWidth, 0) <= listWidth) return;
			const first = items[0];
			const last = items[items.length - 1];
			items.forEach((li) => {
				if (li !== first && li !== last && li !== dotsItem) li.style.display = "none";
			});
			dotsItem.style.display = "flex";
		};
		update();
		window.addEventListener("resize", update);
	});
}
document.addEventListener("DOMContentLoaded", () => {
	initAdaptiveBreadcrumbs();
});
//#endregion
