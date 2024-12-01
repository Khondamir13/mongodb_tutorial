const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("MongoDBga ulanish hosil qilindi...");
  })
  .catch((err) => {
    console.error("MongoDBga ulanish vaqtida xatolik ro'y berdi...", err);
  });

const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Book = mongoose.model("Book", bookSchema);

async function createBook() {
  const book = new Book({
    name: "Javascript asoslari",
    author: "Xondamir Xudayorov",
    tags: ["js", "dasturlash"],
    isPublished: true,
  });

  const savedBook = await book.save();
  console.log(savedBook);
}

async function getBooks() {
  const pageNumber = 3;
  const pageSize = 10;

  const books = await Book.find({ author: "Xondamir Xudayorov" })

    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)

    .sort({ name: 1 })

    .select({ name: 1, tags: 1 });

  console.log(books);
}

getBooks();

// async function updateBook(id) {
//   const book = await Book.findById(id);
//   if (!book) return;
//   book.isPublished = true;
//   book.author = "Xondamir";

//   const updateBook = await  book.save();
// }
// updateBook("Bu yerga id kiritiladi");

// async function deleteBook(id) {
//   const result = await Book.deleteOne({ _id: id });

//   console.log(result);
// }

// deleteBook("Bu yerga o'chirilmoqchi bo'lgan kitobning idisi kiritiladi ");
