"use strict";

const IMAGE_SIZE_ERROR = "Неверный размер изображения";
const IMAGE_FORMAT_ERROR = "Неверный формат изображения";
const MISSING_TEXT_ERROR = "Введите текст новости";
const LIMIT_EXCEEDED_TEXT_ERROR = "Слишком большое количество символов";

let inputTextbox = document.querySelector(".add-form__textbox");
let textboxInfo = document.querySelector(".add-form__textbox-info");
let inputFile = document.querySelector(".add-form__upload-img");
let newsSupply = document.querySelector(".add-form__supply");
let deleteImage = document.querySelector(".add-form__delete-img");

const imagePreview = {
    global: document.querySelector(".add-form__uploaded"),
    icon: document.querySelector(".add-form__uploaded-icon"),
    filename: document.querySelector(".add-form__uploaded-imagename")
};

const errors = {
    formatError: document.querySelector(".add-form__format-error"),
    sizeError: document.querySelector(".add-form__error"),
    textError: document.querySelector(".add-form__error")
};

const imageData = {
    url: null,
    filename: null
};

let fileReader = new FileReader();
let image = new Image();

inputTextbox.onkeyup = function() {
    textboxInfo.innerHTML = `Символов: ${inputTextbox.value.length}/250`;
};

newsSupply.addEventListener("click", function() {
    if (inputTextbox.value < 1) {
        errors.textError.innerHTML = MISSING_TEXT_ERROR;
    }else if (inputTextbox.value.length > 250){
        errors.textError.innerHTML = LIMIT_EXCEEDED_TEXT_ERROR;
    }else {
        resetErrors();
    }
});

deleteImage.addEventListener("click", function() {
    imagePreview.global.style.display = "none";
    inputFile.value = null;
    imageData.filename = null;
    imageData.url = null;
});

const resetErrors = function() {
    for (let key in errors) {
        errors[key].innerHTML = "";
    }
};

inputFile.addEventListener("change", function(){
    let file = inputFile.files[0];
    resetErrors();

    if (file.type && file.type.search("image/+(jpeg|png)") != -1) {
        fileReader.readAsDataURL(file);
        imageData.filename = file.name;

        if (file.name.length > 20) {
            imageData.filename = imageData.filename.slice(0, 20) + "..." + file.type.match("jpeg|png");
        }
    } else {
        errors.formatError.innerHTML = IMAGE_FORMAT_ERROR;
    }
});

fileReader.addEventListener("load", function(e){
    let url = e.target.result;
    image.src = url;
    imageData.url = url;
});

const displayImagePreview = function() {
    imagePreview.icon.src = imageData.url;
    imagePreview.global.style.display = "flex";
    imagePreview.filename.innerHTML = imageData.filename;
};

image.addEventListener("load", function() {
    let width = this.width;
    let height = this.height;

    if (width && height && width <= 270 && height <= 270) {
        displayImagePreview();
    } else {
        errors.sizeError.innerHTML = IMAGE_SIZE_ERROR;
    }
});