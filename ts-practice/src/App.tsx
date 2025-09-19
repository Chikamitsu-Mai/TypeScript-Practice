function App() {

  const language: string = "TypeScript";

  const code: number | null = 200;

  const direction: "北" | "東" | "南" | "西" = "東";

  const isAvailable: boolean[] = [true, false, true];

  const person: { name: string, age: number, isStudent: boolean } = {
    name: "taichi",
    age: 18,
    isStudent: true,
  }

  let data: unknown;

  if (typeof data === "number") {
    console.log("This is a number");
  } else if (typeof data === "string") {
    console.log("This is a string");
  } else if (typeof data === "boolean") {
    console.log("This is a boolean");
  } else {
    console.log("Unknown type");
  }

  type Status = "pending" | "resolved" | "rejected";

  type Process = {
    id: number;
    title: string;
    status: Status;
    manager: string;
  }
  interface Employee {
    name: string;
    department: "営業" | "開発" | "人事" | "経理";
    position?: string;
    salary: number;
  }

  type Country = {
    readonly name: string;
    readonly capital: string;
    population: number;
  }

  let book: unknown;
  book = {
    title: "Cinderella",
    publicationYear: 1985,
    pages: 46,
    available: true
  };

  (book as { title: string, publicationYear: number, pages: number, available: boolean }).available = false;

  console.log(book);

}

export default App
