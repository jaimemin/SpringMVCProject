const MAX_RATING = 5;
const ERROR_STATUS = 400;
const COMPLETE_STATE = 4;

const registerButtonClickEvent = () => {
	let registerButton = document.querySelector(".box_bk_btn .bk_btn");
	
	registerButton.addEventListener("click", () => {
		if (isCommentValid() === false) {
			alert("오류가 발생했습니다. 글자 수, 별점을 확인해주세요");
			return;
		}
		
		let xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.onreadystatechange = () => {
			if(xmlHttpRequest.status >= ERROR_STATUS) {
				alert("오류가 발생했습니다");
				return;
			}
			
			if(xmlHttpRequest.readyState === COMPLETE_STATE) {
				alert("댓글 등록이 완료되었습니다.");
				window.history.back();
			}
		}
		
		let form = createForm();
		let url = `/Reservation/api/review-write`;
		xmlHttpRequest.open("POST", url);
		xmlHttpRequest.send(form);
	})
}

const createForm = () => {
	let imageFile = document.querySelector(".review_write_footer > #reviewImageFileOpenInput");
	let formData = new FormData();
	
	formData.append("score", document.querySelector(".rating > .star_rank").innerText);
	formData.append("comment", document.querySelector(".review_textarea").value);
	formData.append("productId", document.querySelector("#productId").value);
	formData.append("reservationInfoId", document.querySelector("#reservationInfoId").value);
	formData.append("imageFile", imageFile.files[0]);
	
	return formData;
}

const isCommentValid = () => {
	let textArea = document.querySelector(".review_textarea");
	let countSpan = document.querySelector(".rating > .star_rank");
	let textAreaValid = textArea.textLength >= 5;
	let starValid = !countSpan.classList.contains("gray_star");
	
	return textAreaValid && starValid;
}

const registerImageFileEvents = () => {
	let imageThumbnails = document.querySelector(".lst_thumb");
	let imageInput = document.querySelector(".review_write_footer > #reviewImageFileOpenInput");
	
	imageThumbnails.addEventListener("click", removeThumbnail);
	imageInput.addEventListener("change", addThumbnail);
}

const addThumbnail = () => {
	let imageThumbnails = document.querySelector(".lst_thumb");
	let imageInput = document.querySelector(".review_write_footer > #reviewImageFileOpenInput");
	imageThumbnails.innerHTML = "";
	
	let files = imageInput.files;
	
	if (files.length === 0) {
		return;
	}
	
	if (!imageTypeValidation(files[0])) {
		alert("JPEG, PNG, JPG와 같은 확장자만 가능합니다!");
		return;
	}
	
	let fileReader = new FileReader();
	
	fileReader.readAsDataURL(files[0]);
	fileReader.onload = () => {
		let thumbnail = document.createElement("li");
		thumbnail.classList.add("item");
		thumbnail.style.display="inline-block";
		thumbnail.innerHTML += thumbnailTemplate();
		
		thumbnail.querySelector(".item_thumb").src = fileReader.result;
		imageThumbnails.innerHTML += thumbnail.innerHTML;
	}
}

const imageTypeValidation = (image) => {
	const flag = (["image/jpeg", "image/png", "image/jpg"].indexOf(image.type) > -1);
	
	return flag;
}

const removeThumbnail = (event) => {
	if (event.target.classList.contains("spr_book")
			|| event.target.classList.contains("ico_del")) {
		let imageInput = document.querySelector(".review_write_footer > #reviewImageFileOpenInput");
		
		event.target.closest("li").remove();
		imageInput.value = "";
		event.stopPropagation();
	}
}

const registerRatingStarEvent = () => {
	let ratingArea = document.querySelector(".review_rating > .rating");
	let stars = document.querySelectorAll(".rating > .rating_rdo");
	let countSpan = document.querySelector(".rating > .star_rank");
	
	ratingArea.addEventListener("click", (event) => {
		if (event.target.type === "checkbox") {
			let rating = event.target.value;
			
			for (let index = 0; index < rating; index++) {
				stars[index].checked = true;
			}
			
			for (let index = rating; index < MAX_RATING; index++) {
				stars[index].checked = false;
			}
			
			countSpan.innerText = rating;
			
			if (rating === 0) {
				countSpan.classList.add("gray_star");
			} else {
				countSpan.classList.remove("gray_star");
			}
		}
	});
}

const registerTextAreaEvents = () => {
	let textArea = document.querySelector(".review_textarea");
	let writeInfo = document.querySelector(".review_write_info");
	let textCount = document.querySelector("#text_count");
	
	writeInfo.addEventListener("click", () => {
		writeInfo.style.display = "none";
		textArea.focus();
	});
	
	textArea.addEventListener("input", () => {
		textCount.innerText = textArea.textLength;
	});
	
	textArea.onblur = () => {
		if (textArea.textLength === 0) {
			writeInfo.style.display = "block";
			textArea.focus();
		}
	}
}

const limitTextArea = () => {
	let textArea = document.querySelector(".review_textarea");
	
	textArea.minLength = 5;
	textArea.maxLength = 400;
}

document.addEventListener("DOMContentLoaded", () => {
	limitTextArea();
	registerTextAreaEvents();
	registerRatingStarEvent();
	registerImageFileEvents();
	registerButtonClickEvent();
});