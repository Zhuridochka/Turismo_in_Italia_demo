//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/common/functions.js
var slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore && target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore && target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
		}, duration);
	}
};
var slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.hidden = target.hidden ? false : null;
		showmore && target.style.removeProperty("height");
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideDownDone", { detail: { target } }));
		}, duration);
	}
};
var slideToggle = (target, duration = 500) => {
	if (target.hidden) return slideDown(target, duration);
	else return slideUp(target, duration);
};
var bodyLockStatus = true;
var bodyLockToggle = (delay = 500) => {
	if (document.documentElement.hasAttribute("data-fls-scrolllock")) bodyUnlock(delay);
	else bodyLock(delay);
};
var bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach((lockPaddingElement) => {
				lockPaddingElement.style.paddingRight = "";
			});
			document.body.style.paddingRight = "";
			document.documentElement.removeAttribute("data-fls-scrolllock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
var bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
		lockPaddingElements.forEach((lockPaddingElement) => {
			lockPaddingElement.style.paddingRight = lockPaddingValue;
		});
		document.body.style.paddingRight = lockPaddingValue;
		document.documentElement.setAttribute("data-fls-scrolllock", "");
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
		const [value, type = "max"] = item.dataset[dataSetValue].split(",");
		return {
			value,
			type,
			item
		};
	});
	if (media.length === 0) return [];
	const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
	return [...new Set(breakpointsArray)].map((query) => {
		const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
		const matchMedia = window.matchMedia(mediaQuery);
		return {
			itemsArray: media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType),
			matchMedia
		};
	});
}
var gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = "";
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = "header.header";
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains("--header-scroll")) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add("--header-scroll");
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove("--header-scroll");
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else headerItemHeight = headerElement.offsetHeight;
		}
		if (document.documentElement.hasAttribute("data-fls-menu-open")) {
			bodyUnlock();
			document.documentElement.removeAttribute("data-fls-menu-open");
		}
		let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
		targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
		targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
		window.scrollTo({
			top: targetBlockElementPosition,
			behavior: "smooth"
		});
	}
};
//#endregion
//#region src/components/layout/menu/menu.js
function menuInit() {
	document.addEventListener("click", function(e) {
		if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
		}
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
//#region src/components/layout/header/plugins/scroll/scroll.js
function headerScroll() {
	const header = document.querySelector("[data-fls-header-scroll]");
	const headerShow = header.hasAttribute("data-fls-header-scroll-show");
	const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
	const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
	let scrollDirection = 0;
	let timer;
	document.addEventListener("scroll", function(e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		if (scrollTop >= startPoint) {
			!header.classList.contains("--header-scroll") && header.classList.add("--header-scroll");
			if (headerShow) {
				if (scrollTop > scrollDirection) header.classList.contains("--header-show") && header.classList.remove("--header-show");
				else !header.classList.contains("--header-show") && header.classList.add("--header-show");
				timer = setTimeout(() => {
					!header.classList.contains("--header-show") && header.classList.add("--header-show");
				}, headerShowTimer);
			}
		} else {
			header.classList.contains("--header-scroll") && header.classList.remove("--header-scroll");
			if (headerShow) header.classList.contains("--header-show") && header.classList.remove("--header-show");
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
document.querySelector("[data-fls-header-scroll]") && window.addEventListener("load", headerScroll);
//#endregion
//#region src/components/forms/_functions.js
var formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll("[required]");
		if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem) => {
			if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
		});
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.type === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else if (!formRequiredItem.value.trim()) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else {
			this.removeError(formRequiredItem);
			this.addSuccess(formRequiredItem);
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add("--form-error");
		formRequiredItem.parentElement.classList.add("--form-error");
		let inputError = formRequiredItem.parentElement.querySelector("[data-fls-form-error]");
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.flsFormErrtext) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div data-fls-form-error>${formRequiredItem.dataset.flsFormErrtext}</div>`);
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove("--form-error");
		formRequiredItem.parentElement.classList.remove("--form-error");
		if (formRequiredItem.parentElement.querySelector("[data-fls-form-error]")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector("[data-fls-form-error]"));
	},
	addSuccess(formRequiredItem) {
		formRequiredItem.classList.add("--form-success");
		formRequiredItem.parentElement.classList.add("--form-success");
	},
	removeSuccess(formRequiredItem) {
		formRequiredItem.classList.remove("--form-success");
		formRequiredItem.parentElement.classList.remove("--form-success");
	},
	removeFocus(formRequiredItem) {
		formRequiredItem.classList.remove("--form-focus");
		formRequiredItem.parentElement.classList.remove("--form-focus");
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll("input,textarea");
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				formValidate.removeFocus(el);
				formValidate.removeSuccess(el);
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll("input[type=\"checkbox\"]");
			if (checkboxes.length) checkboxes.forEach((checkbox) => {
				checkbox.checked = false;
			});
			if (window["flsSelect"]) {
				let selects = form.querySelectorAll("select[data-fls-select]");
				if (selects.length) selects.forEach((select) => {
					window["flsSelect"].selectBuild(select);
				});
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
};
//#endregion
//#region src/components/forms/form/form.js
function formInit() {
	function formSubmit() {
		const forms = document.forms;
		if (forms.length) for (const form of forms) {
			!form.hasAttribute("data-fls-form-novalidate") && form.setAttribute("novalidate", true);
			form.addEventListener("submit", function(e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener("reset", function(e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
		async function formSubmitAction(form, e) {
			if (formValidate.getErrors(form) === 0) {
				if (form.dataset.flsForm === "ajax") {
					e.preventDefault();
					const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
					const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
					const formData = new FormData(form);
					form.classList.add("--sending");
					const response = await fetch(formAction, {
						method: formMethod,
						body: formData
					});
					if (response.ok) {
						let responseResult = await response.json();
						form.classList.remove("--sending");
						formSent(form, responseResult);
					} else form.classList.remove("--sending");
				} else if (form.dataset.flsForm === "dev") {
					e.preventDefault();
					formSent(form);
				}
			} else {
				e.preventDefault();
				if (form.querySelector(".--form-error") && form.hasAttribute("data-fls-form-gotoerr")) gotoBlock(form.dataset.flsFormGotoerr ? form.dataset.flsFormGotoerr : ".--form-error");
			}
		}
		function formSent(form, responseResult = ``) {
			document.dispatchEvent(new CustomEvent("formSent", { detail: { form } }));
			setTimeout(() => {
				if (window.flsPopup) {
					const popup = form.dataset.flsFormPopup;
					if (form.dataset.flsFormPopupMessage) document.querySelector(`[data-fls-popup="${popup}"] [data-fls-popup-content]`).insertAdjacentHTML("afterbegin", form.dataset.flsFormPopupMessage);
					popup && window.flsPopup.open(popup);
				}
			}, 0);
			formValidate.formClean(form);
		}
	}
	function formFieldsInit() {
		document.body.addEventListener("focusin", function(e) {
			const targetElement = e.target;
			if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
				if (!targetElement.hasAttribute("data-fls-form-nofocus")) {
					targetElement.classList.add("--form-focus");
					targetElement.parentElement.classList.add("--form-focus");
				}
				targetElement.hasAttribute("data-fls-form-validatenow") && formValidate.removeError(targetElement);
			}
		});
		document.body.addEventListener("focusout", function(e) {
			const targetElement = e.target;
			if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
				if (!targetElement.hasAttribute("data-fls-form-nofocus")) {
					targetElement.classList.remove("--form-focus");
					targetElement.parentElement.classList.remove("--form-focus");
				}
				targetElement.hasAttribute("data-fls-form-validatenow") && formValidate.validateInput(targetElement);
			}
		});
	}
	formSubmit();
	formFieldsInit();
}
document.querySelector("[data-fls-form]") && window.addEventListener("load", formInit);
//#endregion
export { slideUp as i, dataMediaQueries as n, slideToggle as r, formValidate as t };
