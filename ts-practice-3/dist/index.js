"use strict";
/** ===========================
 * 共通定数定義一覧
============================ */
const CLASS_NAME = {
    DISABLED: "is_disabled",
    INVALID: "is_invalid",
    ERROR: "is_error",
};
const ERROR_ADDRESS = {
    NOT_FOUND: "郵便番号に対応する住所が見つかりませんでした",
    FAILED: "住所検索に失敗しました",
};
const ERROR_FORM = {
    REQUIRED: "必須項目です",
    CHECK_REQUIRED: "チェックは必須です",
    KANA: "ひらがなで入力してください",
    EMAIL: "メールアドレスの形式が正しくありません",
    ZIPCODE: "半角数字のみ入力してください（ﾊｲﾌﾝなし）",
    EMPTY_ZIPCODE: "郵便番号を入力してください",
};
const zipCodeInput = document.getElementById("zipCode");
const zipCodeError = document.getElementById("zipCodeError");
/** ===========================
   * 送信ボタンの活性・非活性切り替え
  ============================ */
const submitButton = document.querySelector(".formButton");
const toggleDisabledClass = () => {
    const invalids = document.querySelectorAll(`.${CLASS_NAME["INVALID"]}`);
    if (invalids.length !== 0) {
        submitButton.classList.add(CLASS_NAME["DISABLED"]);
    }
    else {
        submitButton.classList.remove(CLASS_NAME["DISABLED"]);
    }
};
const addressError = document.getElementById("addressError");
const addressInput = document.getElementById("address");
const addressInputParentElement = addressInput.closest(".formItem");
const fetchAddress = async (zipCode) => {
    const apiUrl = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // console.log(data);
        // TODO: 正しい条件式を入力してください
        if (data.status !== 200 || !data.results) {
            addressInput.value = "";
            zipCodeError.textContent = ERROR_ADDRESS["NOT_FOUND"];
            return;
        }
        addressInputParentElement.classList.remove(CLASS_NAME["INVALID"], CLASS_NAME["ERROR"]);
        zipCodeError.textContent = "";
        addressError.textContent = "";
        const address = `${data.results[0].address1}${data.results[0].address2}${data.results[0].address3}`;
        addressInput.value = address;
        toggleDisabledClass();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("住所検索APIエラー:", error.message);
        }
        addressInput.value = "";
        zipCodeError.textContent = ERROR_ADDRESS["FAILED"];
    }
};
/** ===========================
   * エラーメッセージの表示・非表示
  ============================ */
const errorTextDisplay = (inputElement, errorElement, errorMessage) => {
    const targetParentElement = inputElement.closest(".formItem");
    if (errorMessage) {
        errorElement.textContent = errorMessage;
        targetParentElement.classList.add(CLASS_NAME["INVALID"], CLASS_NAME["ERROR"]);
    }
    else {
        errorElement.textContent = "";
        targetParentElement.classList.remove(CLASS_NAME["INVALID"], CLASS_NAME["ERROR"]);
    }
};
/** ===========================
   * そのほか必須項目のバリデーションチェック
   * （形式チェックしない項目）
   *
   * * 名前
   * * 住所
  ============================ */
const RequiredItem = document.querySelectorAll(".js_required");
RequiredItem.forEach((formItem) => {
    const inputElement = formItem.querySelector("input");
    const errorElement = formItem.querySelector(".error");
    inputElement.addEventListener("input", () => {
        const isEmpty = inputElement.value.trim() === ""; //inputElement.valueが空文字かどうか
        const errorMessage = isEmpty ? ERROR_FORM["REQUIRED"] : null;
        errorTextDisplay(inputElement, errorElement, errorMessage);
        toggleDisabledClass();
    });
});
/** ===========================
   * チェックボックスのバリデーションチェック
  ============================ */
const agreementInput = document.getElementById("agreement");
const agreementError = document.getElementById("agreementError");
agreementInput.addEventListener("change", () => {
    const agreementValid = agreementInput.checked;
    if (agreementValid) {
        agreementInput.classList.add("is-agree");
        errorTextDisplay(agreementInput, agreementError, null);
    }
    else {
        agreementInput.classList.remove("is-agree");
        errorTextDisplay(agreementInput, agreementError, ERROR_FORM["CHECK_REQUIRED"]);
    }
    toggleDisabledClass();
});
/** ===========================
   * ふりがなのバリデーションチェック
  ============================ */
const kanaRegex = /^([ぁ-んー\s]+)$/;
const kanaNameInput = document.getElementById("kanaName");
const kanaNameError = document.getElementById("kanaNameError");
kanaNameInput.addEventListener("input", () => {
    const isEmpty = kanaNameInput.value.trim() === "";
    const isFormatError = !kanaRegex.test(kanaNameInput.value);
    const errorMessage = () => {
        switch (true) {
            case isEmpty:
                return ERROR_FORM["REQUIRED"];
            case isFormatError:
                return ERROR_FORM["KANA"];
            default:
                return null;
        }
    };
    errorTextDisplay(kanaNameInput, kanaNameError, errorMessage());
    toggleDisabledClass();
});
/** ===========================
   * メールアドレスのバリデーションチェック
  ============================ */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
emailInput.addEventListener("input", () => {
    const isEmpty = emailInput.value.trim() === "";
    const isFormatError = !emailRegex.test(emailInput.value);
    const errorMessage = () => {
        switch (true) {
            case isEmpty:
                return ERROR_FORM["REQUIRED"];
            case isFormatError:
                return ERROR_FORM["EMAIL"];
            default:
                return null;
        }
    };
    errorTextDisplay(emailInput, emailError, errorMessage());
    toggleDisabledClass();
});
/** ===========================
   * 郵便番号のバリデーションチェック
  ============================ */
const numberRegex = /^\d+$/;
zipCodeInput.addEventListener("input", () => {
    const isEmpty = zipCodeInput.value.trim() === "";
    const isFormatError = !numberRegex.test(zipCodeInput.value);
    const errorMessage = () => {
        switch (true) {
            case isEmpty:
                return ERROR_FORM["REQUIRED"];
            case isFormatError:
                return ERROR_FORM["ZIPCODE"];
            default:
                return null;
        }
    };
    errorTextDisplay(zipCodeInput, zipCodeError, errorMessage());
    toggleDisabledClass();
});
/** ===========================
   * 住所検索ボタンクリック時の処理
  ============================ */
const searchAddressButton = document.getElementById("searchAddress");
searchAddressButton.addEventListener("click", () => {
    const zipCode = zipCodeInput.value.trim();
    if (zipCode) {
        fetchAddress(zipCode);
    }
    else {
        zipCodeError.textContent = ERROR_FORM["EMPTY_ZIPCODE"];
    }
});
/** ===========================
   * 初回送信ボタンを非活性にする処理
  ============================ */
document.addEventListener("DOMContentLoaded", () => {
    const formItems = document.querySelectorAll(".formItem");
    formItems.forEach((formItem) => {
        formItem.classList.add(CLASS_NAME["INVALID"]);
    });
    toggleDisabledClass();
});
//NodeListOf<HTMLElement>はNodeListの中にHTMLElementが入っているイメージ
//NodeListはNode(HTMLタグやテキスト)の集合体
//HTMLElementはHTMLの<div>や<input>、<span>などのタグひとつひとつのこと＝要素（Element）
//# sourceMappingURL=index.js.map