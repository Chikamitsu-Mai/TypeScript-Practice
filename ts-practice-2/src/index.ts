type ProductsType = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
};

type CategoriesType = {
  id: number;
  name: string;
  image: string;
};

const BASE_URL = "https://api.escuelajs.co/api/v1";

const getDataUtilFunc = async <T>(
  path: string = "/products",
  query?: string
): Promise<T | void> => {
  try {
    const response = await fetch(BASE_URL + path + `${query ? query : ""}`);

    if (!response.ok) {
      throw new Error("Error");
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
    // catch ブロックで何も返していないと、関数の型 Promise<T> と矛盾する。
    //TypeScript は「この関数は Promise<T> を返すはずなのに、catchで値が返っていない場合がある」と怒る。
    // なので、throw error; として、Promise<T> を返さない場合があることを明示的に示す。
    //(細かく言うと関数はPromiseを返すことを止めたわけではなく、「reject(拒否)されたPromise」を返す」 と TypeScript は判断する)
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const productsButton = document.getElementById("products-button");
  const filteredProductsButton = document.getElementById(
    "filtered-products-button"
  );
  const categoriesButton = document.getElementById("categories-button");

  // 商品ボタンをクリックしたとき
  if (productsButton instanceof HTMLButtonElement) {
    productsButton.addEventListener("click", async () => {
      const productsArray = await getDataUtilFunc<ProductsType[]>();
      console.log(productsArray);
    });
  }

  // フィルタされた商品ボタンをクリックしたとき
  if (filteredProductsButton instanceof HTMLButtonElement) {
    filteredProductsButton.addEventListener("click", async () => {
      const filteredProductsArray = await getDataUtilFunc<ProductsType[]>(
        "/products",
        "/?price_min=900&price_max=1000"
      );
      console.log(filteredProductsArray);
    });
  }

  // カテゴリボタンをクリックしたとき
  if (categoriesButton instanceof HTMLButtonElement) {
    categoriesButton.addEventListener("click", async () => {
      const categoriesArray = await getDataUtilFunc<CategoriesType[]>(
        "/categories"
      );
      console.log(categoriesArray);
    });
  }
});
