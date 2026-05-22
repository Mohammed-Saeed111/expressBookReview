// index.js - السيرفر الرئيسي والـ Endpoints

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// استيراد الدوال المساعدة
const {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getReviewsByISBN
} = require('./general');

const {
  registerUser,
  loginUser,
  verifyToken
} = require('./auth');

// إنشاء تطبيق Express
const app = express();
const PORT = 5000;

// مسارات الملفات
const booksFilePath = path.join(__dirname, 'books.json');

// ==================== Middleware ====================

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== Public Routes ====================

/**
 * GET / - استرجاع جميع الكتب
 */
app.get('/', async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json({
      success: true,
      message: 'تم استرجاع جميع الكتب بنجاح',
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /isbn/:isbn - استرجاع كتاب بـ ISBN
 */
app.get('/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await getBookByISBN(isbn);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `لم يتم العثور على كتاب بـ ISBN: ${isbn}`
      });
    }

    res.json({
      success: true,
      message: 'تم استرجاع الكتاب بنجاح',
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /author/:author - استرجاع كتب بـ اسم المؤلف
 */
app.get('/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const books = await getBooksByAuthor(author);

    res.json({
      success: true,
      message: `تم استرجاع ${books.length} كتاب(ب) للمؤلف: ${author}`,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /title/:title - استرجاع كتب بـ العنوان
 */
app.get('/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const books = await getBooksByTitle(title);

    res.json({
      success: true,
      message: `تم استرجاع ${books.length} كتاب(ب) بـ: ${title}`,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /review/:isbn - استرجاع مراجعات كتاب معين
 */
app.get('/review/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const reviews = await getReviewsByISBN(isbn);

    if (reviews === null) {
      return res.status(404).json({
        success: false,
        message: `لم يتم العثور على كتاب بـ ISBN: ${isbn}`
      });
    }

    res.json({
      success: true,
      message: `تم استرجاع مراجعات الكتاب (ISBN: ${isbn}) بنجاح`,
      isbn,
      reviewsCount: Object.keys(reviews).length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /register - تسجيل مستخدم جديد
 */
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await registerUser(username, password);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /customer/login - تسجيل الدخول
 */
app.post('/customer/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await loginUser(username, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== Protected Routes ====================

/**
 * PUT /customer/auth/review/:isbn - إضافة أو تعديل مراجعة
 */
app.put('/customer/auth/review/:isbn', verifyToken, async (req, res) => {
  try {
    const { isbn } = req.params;
    const { review } = req.body;
    const { username } = req.user;

    // التحقق من البيانات
    if (!review) {
      return res.status(400).json({
        success: false,
        message: 'نص المراجعة مطلوب'
      });
    }

    // قراءة ملف الكتب
    const booksData = fs.readFileSync(booksFilePath, 'utf-8');
    const parsedData = JSON.parse(booksData);

    // البحث عن الكتاب
    const book = parsedData.books.find(b => b.isbn === isbn);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `لم يتم العثور على كتاب بـ ISBN: ${isbn}`
      });
    }

    // إضافة أو تعديل المراجعة
    const isUpdate = book.reviews[username] ? true : false;
    book.reviews[username] = review;

    // حفظ البيانات
    fs.writeFileSync(booksFilePath, JSON.stringify(parsedData, null, 2), 'utf-8');

    const action = isUpdate ? 'تم تعديل' : 'تمت إضافة';
    console.log(`✓ ${action} مراجعة للمستخدم ${username} للكتاب ISBN: ${isbn}`);

    res.json({
      success: true,
      message: `${action} المراجعة بنجاح`,
      isbn,
      username,
      review,
      isUpdate
    });
  } catch (error) {
    console.error('✗ خطأ في إضافة/تعديل المراجعة:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DELETE /customer/auth/review/:isbn - حذف مراجعة المستخدم
 */
app.delete('/customer/auth/review/:isbn', verifyToken, async (req, res) => {
  try {
    const { isbn } = req.params;
    const { username } = req.user;

    // قراءة ملف الكتب
    const booksData = fs.readFileSync(booksFilePath, 'utf-8');
    const parsedData = JSON.parse(booksData);

    // البحث عن الكتاب
    const book = parsedData.books.find(b => b.isbn === isbn);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `لم يتم العثور على كتاب بـ ISBN: ${isbn}`
      });
    }

    // التحقق من وجود مراجعة للمستخدم
    if (!book.reviews[username]) {
      return res.status(404).json({
        success: false,
        message: `لا توجد مراجعة لك على هذا الكتاب`
      });
    }

    // حذف المراجعة
    delete book.reviews[username];

    // حفظ البيانات
    fs.writeFileSync(booksFilePath, JSON.stringify(parsedData, null, 2), 'utf-8');

    console.log(`✓ تم حذف مراجعة المستخدم ${username} للكتاب ISBN: ${isbn}`);

    res.json({
      success: true,
      message: 'تم حذف المراجعة بنجاح',
      isbn,
      username
    });
  } catch (error) {
    console.error('✗ خطأ في حذف المراجعة:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== Error Handling ====================

/**
 * Route غير موجود
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار المطلوب غير موجود',
    path: req.path
  });
});

// ==================== Start Server ====================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  📚 Online Book Store API Server       ║
║  PORT: ${PORT}                              ║
║  STATUS: Running ✓                     ║
╚════════════════════════════════════════╝
  `);
  console.log(`
┌─ Test URLs ─────────────────────────────┐
│ GET  http://localhost:5000/               │
│ GET  http://localhost:5000/isbn/...      │
│ GET  http://localhost:5000/author/...    │
│ POST http://localhost:5000/register      │
│ POST http://localhost:5000/customer/login│
└─────────────────────────────────────────┘
  `);
});
