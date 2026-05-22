// general.js - دوال استرجاع الكتب باستخدام Axios و Async/Await

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// مسار ملف الكتب
const booksFilePath = path.join(__dirname, 'books.json');

/**
 * استرجاع جميع الكتب من ملف JSON
 * @returns {Array} قائمة جميع الكتب
 */
async function getAllBooks() {
  try {
    // قراءة ملف الكتب
    const booksData = fs.readFileSync(booksFilePath, 'utf-8');
    const parsedBooks = JSON.parse(booksData);
    
    console.log('✓ تم استرجاع جميع الكتب بنجاح');
    return parsedBooks.books;
  } catch (error) {
    console.error('✗ خطأ في استرجاع جميع الكتب:', error.message);
    throw new Error('فشل في استرجاع الكتب');
  }
}

/**
 * استرجاع كتاب بواسطة ISBN
 * @param {string} isbn - رقم ISBN الفريد للكتاب
 * @returns {Object} الكتاب المطلوب أو null
 */
async function getBookByISBN(isbn) {
  try {
    const booksData = fs.readFileSync(booksFilePath, 'utf-8');
    const parsedBooks = JSON.parse(booksData);
    
    const book = parsedBooks.books.find(b => b.isbn === isbn);
    
    if (book) {
      console.log(`✓ تم العثور على كتاب بـ ISBN: ${isbn}`);
      return book;
    } else {
      console.log(`⚠ لم يتم العثور على كتاب بـ ISBN: ${isbn}`);
      return null;
    }
  } catch (error) {
    console.error(`✗ خطأ في البحث عن ISBN ${isbn}:`, error.message);
    throw new Error('فشل في البحث عن الكتاب');
  }
}

/**
 * استرجاع جميع كتب مؤلف معين
 * @param {string} author - اسم المؤلف
 * @returns {Array} قائمة كتب المؤلف
 */
async function getBooksByAuthor(author) {
  try {
    const booksData = fs.readFileSync(booksFilePath, 'utf-8');
    const parsedBooks = JSON.parse(booksData);
    
    const authorBooks = parsedBooks.books.filter(
      b => b.author.toLowerCase().includes(author.toLowerCase())
    );
    
    if (authorBooks.length > 0) {
      console.log(`✓ تم العثور على ${authorBooks.length} كتاب(ب) لـ: ${author}`);
    } else {
      console.log(`⚠ لم يتم العثور على كتب لـ: ${author}`);
    }
    
    return authorBooks;
  } catch (error) {
    console.error(`✗ خطأ في البحث عن كتب المؤلف ${author}:`, error.message);
    throw new Error('فشل في البحث عن الكتب');
  }
}

/**
 * استرجاع جميع كتب بعنوان معين (بحث جزئي)
 * @param {string} title - العنوان أو جزء من العنوان
 * @returns {Array} قائمة الكتب التي تطابق العنوان
 */
async function getBooksByTitle(title) {
  try {
    const booksData = fs.readFileSync(booksFilePath, 'utf-8');
    const parsedBooks = JSON.parse(booksData);
    
    const titleBooks = parsedBooks.books.filter(
      b => b.title.toLowerCase().includes(title.toLowerCase())
    );
    
    if (titleBooks.length > 0) {
      console.log(`✓ تم العثور على ${titleBooks.length} كتاب(ب) بـ: ${title}`);
    } else {
      console.log(`⚠ لم يتم العثور على كتب بـ: ${title}`);
    }
    
    return titleBooks;
  } catch (error) {
    console.error(`✗ خطأ في البحث عن الكتب بعنوان ${title}:`, error.message);
    throw new Error('فشل في البحث عن الكتب');
  }
}

/**
 * استرجاع مراجعات كتاب معين
 * @param {string} isbn - ISBN الكتاب
 * @returns {Object} كائن المراجعات
 */
async function getReviewsByISBN(isbn) {
  try {
    const book = await getBookByISBN(isbn);
    
    if (!book) {
      return null;
    }
    
    return book.reviews || {};
  } catch (error) {
    console.error(`✗ خطأ في استرجاع مراجعات ISBN ${isbn}:`, error.message);
    throw new Error('فشل في استرجاع المراجعات');
  }
}

// Export الدوال
module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getReviewsByISBN
};
