# 📚 Online Book Store API

مشروع متكامل لمتجر كتب عبر الإنترنت مع نظام مراجعات محمي بـ JWT Authentication.

## ✨ المميزات

- ✅ نظام تسجيل وتسجيل دخول محمي
- ✅ JWT Authentication لحماية الـ Endpoints
- ✅ إدارة مراجعات الكتب (إضافة، تعديل، حذف)
- ✅ البحث عن الكتب (بـ ISBN, Author, Title)
- ✅ معالجة شاملة للأخطاء
- ✅ استخدام Axios و Async/Await

## 🛠️ التثبيت

### 1. تثبيت الحزم المطلوبة
```bash
npm install
```

### 2. تشغيل السيرفر
```bash
npm start
```

السيرفر سيبدأ على المنفذ **5000**

## 📋 هيكل المشروع

```
expressBookReview/
├── index.js              # السيرفر الرئيسي والـ Endpoints
├── general.js            # دوال استرجاع الكتب
├── auth.js               # دوال المصادقة والتسجيل
├── books.json            # قاعدة بيانات الكتب
├── users.json            # تخزين المستخدمين
├── package.json          # الحزم والمتطلبات
└── README.md             # هذا الملف
```

## 📡 الـ API Endpoints

### Routes عامة (بدون مصادقة)

#### 1. استرجاع جميع الكتب
```http
GET /
```
**الرد:**
```json
{
  "success": true,
  "message": "تم استرجاع جميع الكتب بنجاح",
  "count": 6,
  "books": [...]
}
```

#### 2. البحث عن كتاب بـ ISBN
```http
GET /isbn/:isbn
```
**المثال:**
```bash
curl http://localhost:5000/isbn/9780132350884
```

#### 3. البحث عن كتب بـ اسم المؤلف
```http
GET /author/:author
```
**المثال:**
```bash
curl http://localhost:5000/author/Robert
```

#### 4. البحث عن كتب بـ العنوان
```http
GET /title/:title
```
**المثال:**
```bash
curl http://localhost:5000/title/JavaScript
```

#### 5. استرجاع مراجعات كتاب
```http
GET /review/:isbn
```
**المثال:**
```bash
curl http://localhost:5000/review/9780132350884
```

#### 6. تسجيل مستخدم جديد
```http
POST /register
Content-Type: application/json

{
  "username": "ahmed",
  "password": "password123"
}
```
**المثال:**
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ahmed","password":"password123"}'
```

#### 7. تسجيل الدخول
```http
POST /customer/login
Content-Type: application/json

{
  "username": "ahmed",
  "password": "password123"
}
```
**المثال:**
```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ahmed","password":"password123"}'
```

**الرد:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "ahmed"
}
```

---

### Routes محمية (تتطلب JWT Authentication)

#### 8. إضافة أو تعديل مراجعة
```http
PUT /customer/auth/review/:isbn
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "review": "كتاب رائع جداً! يوصى به للجميع"
}
```
**المثال:**
```bash
curl -X PUT http://localhost:5000/customer/auth/review/9780132350884 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"review":"كتاب رائع جداً!"}'
```

**الرد:**
```json
{
  "success": true,
  "message": "تمت إضافة المراجعة بنجاح",
  "isbn": "9780132350884",
  "username": "ahmed",
  "review": "كتاب رائع جداً!",
  "isUpdate": false
}
```

#### 9. حذف مراجعة
```http
DELETE /customer/auth/review/:isbn
Authorization: Bearer {TOKEN}
```
**المثال:**
```bash
curl -X DELETE http://localhost:5000/customer/auth/review/9780132350884 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**الرد:**
```json
{
  "success": true,
  "message": "تم حذف المراجعة بنجاح",
  "isbn": "9780132350884",
  "username": "ahmed"
}
```

---

## 🧪 اختبار API

### خطوات الاختبار الكاملة

#### 1️⃣ استرجاع جميع الكتب
```bash
curl http://localhost:5000/
```

#### 2️⃣ تسجيل مستخدم جديد
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

#### 3️⃣ تسجيل الدخول (احفظ الـ Token)
```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

**سيعطيك رد يحتوي على الـ Token، مثلاً:**
```
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4️⃣ إضافة مراجعة (استخدم الـ Token)
```bash
curl -X PUT http://localhost:5000/customer/auth/review/9780132350884 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"review":"كتاب رائع جداً!"}'
```

#### 5️⃣ عرض المراجعات
```bash
curl http://localhost:5000/review/9780132350884
```

#### 6️⃣ تعديل المراجعة
```bash
curl -X PUT http://localhost:5000/customer/auth/review/9780132350884 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"review":"كتاب ممتاز جداً بصراحة!"}'
```

#### 7️⃣ حذف المراجعة
```bash
curl -X DELETE http://localhost:5000/customer/auth/review/9780132350884 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔐 المصادقة (JWT)

### كيفية عمل JWT
1. المستخدم يسجل الدخول بـ username و password
2. السيرفر يتحقق من البيانات ويعطي JWT token
3. المستخدم يرسل الـ token مع كل طلب محمي في header: `Authorization: Bearer TOKEN`
4. السيرفر يتحقق من صحة التوكن

### تفاصيل الـ JWT
- **Secret Key**: `my_secret_key_123`
- **Token Expiry**: `1 hour`
- **Algorithm**: HS256

---

## 📚 الكتب المتوفرة

```json
[
  {
    "isbn": "9780132350884",
    "title": "Clean Code",
    "author": "Robert C. Martin"
  },
  {
    "isbn": "9781491952023",
    "title": "JavaScript: The Good Parts",
    "author": "Douglas Crockford"
  },
  {
    "isbn": "9781593275846",
    "title": "Eloquent JavaScript",
    "author": "Marijn Haverbeke"
  },
  {
    "isbn": "9781449373320",
    "title": "Understanding ECMAScript 6",
    "author": "Nicholas C. Zakas"
  },
  {
    "isbn": "9780134190440",
    "title": "The Pragmatic Programmer",
    "author": "David Thomas"
  },
  {
    "isbn": "9780201633610",
    "title": "Design Patterns",
    "author": "Gang of Four"
  }
]
```

---

## 📝 الملفات المهمة

### books.json
يحتوي على قائمة الكتب مع:
- ISBN (رقم فريد)
- Title (العنوان)
- Author (المؤلف)
- Reviews (كائن المراجعات)

### users.json
يحتوي على قائمة المستخدمين المسجلين

### general.js
الدوال المساعدة:
- `getAllBooks()` - استرجاع جميع الكتب
- `getBookByISBN(isbn)` - البحث بـ ISBN
- `getBooksByAuthor(author)` - البحث بـ اسم المؤلف
- `getBooksByTitle(title)` - البحث بـ العنوان
- `getReviewsByISBN(isbn)` - استرجاع مراجعات الكتاب

### auth.js
دوال المصادقة:
- `registerUser(username, password)` - تسجيل مستخدم
- `loginUser(username, password)` - تسجيل الدخول
- `verifyToken(req, res, next)` - Middleware للتحقق من الـ JWT

---

## 🐛 معالجة الأخطاء

جميع الأخطاء يتم التعامل معها بشكل آمن:

```json
{
  "success": false,
  "message": "رسالة الخطأ هنا"
}
```

---

## 🚀 تحسينات مستقبلية محتملة

- [ ] تشفير كلمات المرور (bcrypt)
- [ ] قاعدة بيانات حقيقية (MongoDB, PostgreSQL)
- [ ] Refresh Tokens
- [ ] Rate Limiting
- [ ] Logging متقدم
- [ ] اختبارات وحدة (Unit Tests)
- [ ] Validation أفضل للبيانات

---

## 📄 الترخيص

ISC

---

## 👨‍💻 الملاحظات

- هذا المشروع يستخدم ملفات JSON ثابتة للبيانات لأغراض التطوير
- في التطبيقات الحقيقية، يجب استخدام قاعدة بيانات حقيقية
- كلمات المرور تُخزن بدون تشفير (آمن فقط للتطوير)
- جميع الرسائل تدعم اللغة العربية 🇸🇦

---

**تم الإنشاء بنجاح ✨**
