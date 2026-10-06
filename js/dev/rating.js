//#region src/components/forms/rating/rating.js
function formRating() {
	const ratings = document.querySelectorAll("[data-fls-rating]");
	if (ratings) ratings.forEach((rating) => {
		const ratingValue = +rating.dataset.flsRatingValue;
		formRatingInit(rating, +rating.dataset.flsRatingSize ? +rating.dataset.flsRatingSize : 5);
		ratingValue && formRatingSet(rating, ratingValue);
		document.addEventListener("click", formRatingAction);
	});
	function formRatingAction(e) {
		const targetElement = e.target;
		if (targetElement.closest(".rating__input")) {
			const currentElement = targetElement.closest(".rating__input");
			const ratingValue = +currentElement.value;
			const rating = currentElement.closest(".rating");
			rating.dataset.flsRating === "set" && formRatingGet(rating, ratingValue);
		}
	}
	function formRatingInit(rating, ratingSize) {
		let ratingItems = ``;
		for (let index = 0; index < ratingSize; index++) {
			index === 0 && (ratingItems += `<div class="rating__items">`);
			ratingItems += `
				<label class="rating__item">
					<input class="rating__input" type="radio" name="rating" value="${index + 1}">
				</label>`;
			index === ratingSize && (ratingItems += `</div">`);
		}
		rating.insertAdjacentHTML("beforeend", ratingItems);
	}
	function formRatingGet(rating, ratingValue) {
		formRatingSet(rating, ratingValue);
	}
	function formRatingSet(rating, value) {
		const ratingItems = rating.querySelectorAll(".rating__item");
		const resultFullItems = parseInt(value);
		const resultPartItem = value - resultFullItems;
		rating.hasAttribute("data-rating-title") && (rating.title = value);
		ratingItems.forEach((ratingItem, index) => {
			ratingItem.classList.remove("rating__item--active");
			ratingItem.querySelector("span") && ratingItems[index].querySelector("span").remove();
			if (index <= resultFullItems - 1) ratingItem.classList.add("rating__item--active");
			if (index === resultFullItems && resultPartItem) ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
		});
	}
}
document.querySelector("[data-fls-rating]") && window.addEventListener("load", formRating);
//#endregion
