/** ===========================
 * 共通定数定義一覧
============================ */
declare const CLASS_NAME: {
    DISABLED: string;
    INVALID: string;
    ERROR: string;
};
declare const ERROR_ADDRESS: {
    readonly NOT_FOUND: "郵便番号に対応する住所が見つかりませんでした";
    readonly FAILED: "住所検索に失敗しました";
};
declare const ERROR_FORM: {
    readonly REQUIRED: "必須項目です";
    readonly CHECK_REQUIRED: "チェックは必須です";
    readonly KANA: "ひらがなで入力してください";
    readonly EMAIL: "メールアドレスの形式が正しくありません";
    readonly ZIPCODE: "半角数字のみ入力してください（ﾊｲﾌﾝなし）";
    readonly EMPTY_ZIPCODE: "郵便番号を入力してください";
};
declare const zipCodeInput: HTMLInputElement;
declare const zipCodeError: HTMLSpanElement;
/** ===========================
   * 送信ボタンの活性・非活性切り替え
  ============================ */
declare const submitButton: HTMLButtonElement;
declare const toggleDisabledClass: () => void;
/** ===========================
   * 郵便番号から住所を取得
  ============================ */
type ResponseData = {};
declare const addressError: HTMLSpanElement;
declare const addressInput: HTMLInputElement;
declare const addressInputParentElement: HTMLDivElement;
type ApiResult = {
    address1: string;
    address2: string;
    address3: string;
    kana1: string;
    kana2: string;
    kana3: string;
    prefcode: string;
    zipcode: string;
};
type ApiResponse = {
    message: string | null;
    results: ApiResult[] | null;
    status: number;
};
declare const fetchAddress: (zipCode: string) => Promise<void>;
/** ===========================
   * エラーメッセージの表示・非表示
  ============================ */
declare const errorTextDisplay: (inputElement: HTMLInputElement, errorElement: HTMLSpanElement, errorMessage: (typeof ERROR_FORM)[keyof typeof ERROR_FORM] | null) => void;
/** ===========================
   * そのほか必須項目のバリデーションチェック
   * （形式チェックしない項目）
   *
   * * 名前
   * * 住所
  ============================ */
declare const RequiredItem: NodeListOf<HTMLElement>;
/** ===========================
   * チェックボックスのバリデーションチェック
  ============================ */
declare const agreementInput: HTMLInputElement;
declare const agreementError: HTMLSpanElement;
/** ===========================
   * ふりがなのバリデーションチェック
  ============================ */
declare const kanaRegex: RegExp;
declare const kanaNameInput: HTMLInputElement;
declare const kanaNameError: HTMLSpanElement;
/** ===========================
   * メールアドレスのバリデーションチェック
  ============================ */
declare const emailRegex: RegExp;
declare const emailInput: HTMLInputElement;
declare const emailError: HTMLSpanElement;
/** ===========================
   * 郵便番号のバリデーションチェック
  ============================ */
declare const numberRegex: RegExp;
/** ===========================
   * 住所検索ボタンクリック時の処理
  ============================ */
declare const searchAddressButton: HTMLButtonElement;
