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
} as const;

const ERROR_FORM = {
  REQUIRED: "必須項目です",
  CHECK_REQUIRED: "チェックは必須です",
  KANA: "ひらがなで入力してください",
  EMAIL: "メールアドレスの形式が正しくありません",
  ZIPCODE: "半角数字のみ入力してください（ﾊｲﾌﾝなし）",
  EMPTY_ZIPCODE: "郵便番号を入力してください",
} as const;

const zipCodeInput = document.getElementById("zipCode") as HTMLInputElement;
const zipCodeError = document.getElementById("zipCodeError") as HTMLSpanElement;

/** ===========================
   * 送信ボタンの活性・非活性切り替え
  ============================ */
const submitButton = document.querySelector(".formButton") as HTMLButtonElement;

const toggleDisabledClass = (): void => {
  const invalids: NodeListOf<HTMLLIElement> = document.querySelectorAll(
    `.${CLASS_NAME["INVALID"]}`
  );

  if (invalids.length !== 0) {
    submitButton.classList.add(CLASS_NAME["DISABLED"]);
  } else {
    submitButton.classList.remove(CLASS_NAME["DISABLED"]);
  }
};

/** ===========================
   * 郵便番号から住所を取得
  ============================ */
// TODO: 定数名 data に対する型定義を必ずしてください。
type ResponseData = {};

const addressError = document.getElementById("addressError") as HTMLSpanElement;
const addressInput = document.getElementById("address") as HTMLInputElement;
const addressInputParentElement = addressInput.closest(
  ".formItem"
) as HTMLDivElement;

type ApiResult = {
  address1: string;
  address2: string;
  address3: string;
  kana1: string;
  kana2: string;
  kana3: string;
  prefcode: string;
  zipcode: string;
}

type ApiResponse = {
  message: string | null;
  results: ApiResult[] | null;
  status: number;
};

const fetchAddress = async (zipCode: string): Promise<void> => {
  const apiUrl: string = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`;

  try {
    const response = await fetch(apiUrl);
    const data: ApiResponse = await response.json();
    // console.log(data);

    // TODO: 正しい条件式を入力してください
    if (data.status !== 200 || !data.results) {
      addressInput.value = "";
      zipCodeError.textContent = ERROR_ADDRESS["NOT_FOUND"];
      return;
    }

    addressInputParentElement.classList.remove(
      CLASS_NAME["INVALID"],
      CLASS_NAME["ERROR"]
    );
    zipCodeError.textContent = "";
    addressError.textContent = "";

    const address: string = `${data.results[0].address1}${data.results[0].address2}${data.results[0].address3}`;
    addressInput.value = address;

    toggleDisabledClass();
  } catch (error) {
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
const errorTextDisplay = (
  inputElement: HTMLInputElement,
  errorElement: HTMLSpanElement,
  errorMessage: (typeof ERROR_FORM)[keyof typeof ERROR_FORM] | null
): void => {
  const targetParentElement = inputElement.closest(
    ".formItem"
  ) as HTMLDivElement;

  if (errorMessage) {
    errorElement.textContent = errorMessage;
    targetParentElement.classList.add(
      CLASS_NAME["INVALID"],
      CLASS_NAME["ERROR"]
    );

  } else {
    errorElement.textContent = "";
    targetParentElement.classList.remove(
      CLASS_NAME["INVALID"],
      CLASS_NAME["ERROR"]
    );
  }
};

/** ===========================
   * そのほか必須項目のバリデーションチェック
   * （形式チェックしない項目）
   *
   * * 名前
   * * 住所
  ============================ */
const RequiredItem: NodeListOf<HTMLElement> =
  document.querySelectorAll(".js_required");

RequiredItem.forEach((formItem: HTMLElement) => {
  const inputElement = formItem.querySelector("input") as HTMLInputElement;
  const errorElement = formItem.querySelector(".error") as HTMLSpanElement;

  inputElement.addEventListener("input", (): void => {
    const isEmpty: boolean = inputElement.value.trim() === "";//inputElement.valueが空文字かどうか
    const errorMessage: (typeof ERROR_FORM)[keyof typeof ERROR_FORM] | null =
      isEmpty ? ERROR_FORM["REQUIRED"] : null;

    errorTextDisplay(inputElement, errorElement, errorMessage);
    toggleDisabledClass();
  });
});

/** ===========================
   * チェックボックスのバリデーションチェック
  ============================ */
const agreementInput = document.getElementById("agreement") as HTMLInputElement;
const agreementError = document.getElementById(
  "agreementError"
) as HTMLSpanElement;

agreementInput.addEventListener("change", (): void => {
  const agreementValid: boolean = agreementInput.checked;

  if (agreementValid) {
    agreementInput.classList.add("is-agree");
    errorTextDisplay(agreementInput, agreementError, null);
  } else {
    agreementInput.classList.remove("is-agree");
    errorTextDisplay(
      agreementInput,
      agreementError,
      ERROR_FORM["CHECK_REQUIRED"]
    );
  }

  toggleDisabledClass();
});

/** ===========================
   * ふりがなのバリデーションチェック
  ============================ */
const kanaRegex: RegExp = /^([ぁ-んー\s]+)$/;
const kanaNameInput = document.getElementById("kanaName") as HTMLInputElement;
const kanaNameError = document.getElementById(
  "kanaNameError"
) as HTMLSpanElement;

kanaNameInput.addEventListener("input", (): void => {
  const isEmpty: boolean = kanaNameInput.value.trim() === "";
  const isFormatError: boolean = !kanaRegex.test(kanaNameInput.value);

  const errorMessage = ():
    | (typeof ERROR_FORM)[keyof typeof ERROR_FORM]
    | null => {
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
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailInput = document.getElementById("email") as HTMLInputElement;
const emailError = document.getElementById("emailError") as HTMLSpanElement;

emailInput.addEventListener("input", (): void => {
  const isEmpty: boolean = emailInput.value.trim() === "";
  const isFormatError: boolean = !emailRegex.test(emailInput.value);

  const errorMessage = ():
    | (typeof ERROR_FORM)[keyof typeof ERROR_FORM]
    | null => {
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
const numberRegex: RegExp = /^\d+$/;

zipCodeInput.addEventListener("input", (): void => {
  const isEmpty: boolean = zipCodeInput.value.trim() === "";
  const isFormatError: boolean = !numberRegex.test(zipCodeInput.value);

  const errorMessage = ():
    | (typeof ERROR_FORM)[keyof typeof ERROR_FORM]
    | null => {
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
const searchAddressButton = document.getElementById(
  "searchAddress"
) as HTMLButtonElement;

searchAddressButton.addEventListener("click", (): void => {
  const zipCode: string = zipCodeInput.value.trim();

  if (zipCode) {
    fetchAddress(zipCode);
  } else {
    zipCodeError.textContent = ERROR_FORM["EMPTY_ZIPCODE"];
  }
});

/** ===========================
   * 初回送信ボタンを非活性にする処理
  ============================ */
document.addEventListener("DOMContentLoaded", (): void => {
  const formItems: NodeListOf<HTMLElement> =
    document.querySelectorAll(".formItem");

  formItems.forEach((formItem: HTMLElement) => {
    formItem.classList.add(CLASS_NAME["INVALID"]);
  });
  toggleDisabledClass();
});
//NodeListOf<HTMLElement>はNodeListの中にHTMLElementが入っているイメージ
//NodeListはNode(HTMLタグやテキスト)の集合体
//HTMLElementはHTMLの<div>や<input>、<span>などのタグひとつひとつのこと＝要素（Element）