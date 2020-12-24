"use strict";

let loginButton = document.querySelector(".navigate-header_right-top__login");
let popupWindow = document.querySelector(".authorisation-container");
let closeButton = document.querySelector(".authorisation-form__close");
let supplyButton = document.querySelector(".authorisation-form__supply");
let background = document.querySelector(".authorisation-container");

let error = document.querySelector(".authorisation-form__input-error");

const inputData = {
    email: document.querySelector("#email"),
    password: document.querySelector("#password"),
    global: document.querySelector(".authorisation-form__field")
}

const INVALID_DATA = "Некорректный ввод данных, повторите попытку";

loginButton.onclick = function(){
    popupWindow.style.display = "flex";
}

closeButton.onclick = function() {
    popupWindow.style.display = "none";
}

background.onmousedown = function(e) {
    if ($(e.target).is(popupWindow)){
        popupWindow.style.display = "none";
    }
}

supplyButton.onclick = function(){
    let invFields = getInvalidFields();

    if (invFields.length > 0) {
        displayErrors(invFields);
    } else {
        document.location.href = "../html/admin.html";
        inputData.global.style.border = "1px solid #23415E";
        error.innerHTML = "";
    }

let getInvalidFields = function() {
    let data = [];

    for (let key in inputData) {
        let inp = inputData[key];

        if (!inp.validity.valid) {
            data.push(inp);
        }
    }

    return data;
}

let displayErrors = function(data) {
    error.innerHTML = INVALID_DATA;

    for (let key in data) {
        data[key].style.border = "1px solid red";
    }
}
}