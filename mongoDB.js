const mongoose = require("mongoose");

//malumotlar omboriga ulanish uchun connect degan methodi ishlatiladi
mongoose
  .connect("mongodb://localhost/test")
  // agar malumotlar omboriga ulansa then ishlaydi
  .then(() => {
    console.log("MongoDBga ulanish hosil qilindi...");
  })
  .catch((err) => {
    console.error("MongoDBga ulanish vaqtida xatolik ro'y berdi...", err);
  });

// Schema mongoDBdagi hujjatning qanday hususiyatlardan tashkil topganligini aniqlash uchun ishlatiladi

// const bookSchema = new mongoose.Schema({
//   name: String,
//   author: String,
//   tags: [String],
//   date: { type: Date, default: Date.now },
//   isPublished: Boolean,
// });
// Hujjatning turini yozishda ishlatishimiz mumkin bo'lgan malumot turlari => String, number, boolean, date, buffer, objectId,array

// Model
// Class biror narsaning tavsifi bo'lsa, object esa shu tavsifning ko'rinishi hisoblanadi
// kitobni databasega saqlash uchun uning birinchi classi kerak bo'ladi, class asosida object tuzib shuni mongoDb ga saqlab qoya olamiz
// model bizga class qaytarib beradi
const Book = mongoose.model("Book", bookSchema);

async function createBook() {
  const book = new Book({
    name: "Javascript asoslari",
    author: "Xondamir Xudayorov",
    tags: ["js", "dasturlash"],
    isPublished: true,
  });
  // Hujjatni mongoDbga saqlash
  const savedBook = await book.save();
  console.log(savedBook);
}

async function getBooks() {
  const pageNumber = 3;
  const pageSize = 10;

  // find methodi bazadagi hujjatlarni o'qish uchun ishaltiladi
  // find methodining ichiga filtr methodini ham bersak bo'ladi faqat {} qavslar ichida yoziladi
  const books = await Book.find({ author: "Xondamir Xudayorov" })
    // .or([{ author: "Xondamir Xudayorov" }, { isPublished: true }]) // berilgan  shartning qaysidiriga javob bola oladigan malumotlar qaytarilib beriladi
    // hujjatlarni pagination qilish
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    // sort methodining ichiga ham obeykt beriladi keyin nima bo'yicha sort qilinish sharti yoziladi
    .sort({ name: 1 })
    // select methodi malumotlarning qaysi hossasi kerak bo'lsa ishlatiladi
    .select({ name: 1, tags: 1 });
  // bazada qancha malumot borligini bilish uchun count methodidan foydalanamiz
  console.log(books);
  // const book = await Book.find({ price: { $gt: 30, $lt: 40 } }) // bu code bizga narxi 30 dan katta lekin 40 dollardan past bo'lgan kitoblarni qaytarib beradi
}

getBooks();

// solishtiruv operatorlari
// bazadan malumotlarni olishda agar solishtirmoqchi bo'lsak shulardan foydalanamiz
// bu solishtiruv operatorlari ishlatilayotganda ular oldiga $ belgisi qo'yiladi
// eq (equal) teng
// ne (not equal) teng emas
// gt (greather than) dan kattaroq
// gte (greather than or equal) katta yoki teng
// lt (less than)  dan kichkina
// lte ( less than or equal) kichik yoki teng
// in nin (not in)

// bazadan ismi F harfi bilan boshlanadigan malumotlat kerak bo'lsa RegEx dan foydalanamiz

// .find({ author: /^F/ }) // Muallifning ismi Fharfidan boshlanadigan hujjatlarni olib beradi
// .find({ author: /od$/ }) // Muallifning ismi od harflari bilan tamomlangan hujjatlarni olib beradi
// .find({ author: /.*ham.*/i }) // Muallifning ismida ham so'zi uchragan hujjatlarni olib beradi

// Ichki validatorlar
// bular asosan Schema ichiga yoziladi

// required berilgan hossani kiritish kerakligini bildiradi

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  // bu validator har bitta kitobning eng kamida bitta tegi bo'lishini ko'rsatadi

  tags: {
    type: Array,
    validate: {
      // bu validator asinxiron ekanligini ko'rsatadi isAsync
      isAsync: true,
      validator: function (val, callback) {
        setTimeout(() => {
          // bu yerda valueni null qiymatga va uzunligini 0 dan kattaliginini tekshirish joyi
          const result = val && val.length > 0;
          callback(result);
        }, 5000);
      },
      message: "Kitobning kamida bitta tegi bo'lishi kerak",

      // message shu validatorning xatosi beriladi
      // messagega validatordan o'tibmay qolganda,  qaytarib beriladigan matn yoziladi
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});
