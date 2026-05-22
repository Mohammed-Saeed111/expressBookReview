// auth.js - دوال المصادقة والتسجيل

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// مسار ملف المستخدمين
const usersFilePath = path.join(__dirname, 'users.json');

// مفتاح سري للتوقيع
const SECRET_KEY = 'my_secret_key_123';

// مدة صلاحية التوكن (1 ساعة)
const TOKEN_EXPIRY = '1h';

/**
 * قراءة قائمة المستخدمين من ملف JSON
 * @returns {Array} قائمة المستخدمين
 */
function readUsers() {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf-8');
    const parsedUsers = JSON.parse(usersData);
    return parsedUsers.users || [];
  } catch (error) {
    console.error('✗ خطأ في قراءة ملف المستخدمين:', error.message);
    return [];
  }
}

/**
 * حفظ قائمة المستخدمين في ملف JSON
 * @param {Array} users - قائمة المستخدمين
 */
function writeUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2), 'utf-8');
    console.log('✓ تم حفظ المستخدمين بنجاح');
  } catch (error) {
    console.error('✗ خطأ في حفظ ملف المستخدمين:', error.message);
    throw new Error('فشل في حفظ المستخدم');
  }
}

/**
 * تسجيل مستخدم جديد
 * @param {string} username - اسم المستخدم
 * @param {string} password - كلمة المرور
 * @returns {Object} رسالة النجاح أو الفشل
 */
async function registerUser(username, password) {
  try {
    // التحقق من صحة البيانات
    if (!username || !password) {
      throw new Error('اسم المستخدم وكلمة المرور مطلوبة');
    }

    if (username.length < 3) {
      throw new Error('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
    }

    if (password.length < 3) {
      throw new Error('كلمة المرور يجب أن تكون 3 أحرف على الأقل');
    }

    // قراءة المستخدمين الحاليين
    const users = readUsers();

    // التحقق من عدم تكرار اسم المستخدم
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      throw new Error('اسم المستخدم موجود بالفعل');
    }

    // إضافة المستخدم الجديد
    const newUser = {
      id: Date.now(),
      username,
      password // في التطبيق الحقيقي يجب تشفير كلمة المرور
    };

    users.push(newUser);
    writeUsers(users);

    console.log(`✓ تم تسجيل المستخدم ${username} بنجاح`);
    return {
      success: true,
      message: 'تم التسجيل بنجاح',
      username
    };
  } catch (error) {
    console.error('✗ خطأ في تسجيل المستخدم:', error.message);
    throw error;
  }
}

/**
 * تسجيل دخول المستخدم وإرجاع JWT token
 * @param {string} username - اسم المستخدم
 * @param {string} password - كلمة المرور
 * @returns {Object} JWT token والبيانات المتعلقة به
 */
async function loginUser(username, password) {
  try {
    // التحقق من صحة البيانات
    if (!username || !password) {
      throw new Error('اسم المستخدم وكلمة المرور مطلوبة');
    }

    // قراءة المستخدمين
    const users = readUsers();

    // البحث عن المستخدم والتحقق من كلمة المرور
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
    }

    // إنشاء JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRY }
    );

    console.log(`✓ تم تسجيل دخول المستخدم ${username} بنجاح`);
    return {
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      username
    };
  } catch (error) {
    console.error('✗ خطأ في تسجيل الدخول:', error.message);
    throw error;
  }
}

/**
 * Middleware للتحقق من صلاحية JWT token
 * @param {Object} req - طلب Express
 * @param {Object} res - رد Express
 * @param {Function} next - دالة التمرير للـ middleware التالي
 */
function verifyToken(req, res, next) {
  try {
    // استخراج التوكن من header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'التوكن غير موجود أو صيغته غير صحيحة'
      });
    }

    // استخراج التوكن من "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, SECRET_KEY);

    // حفظ بيانات المستخدم في الـ request لاستخدامها لاحقاً
    req.user = decoded;

    console.log(`✓ تم التحقق من التوكن للمستخدم: ${decoded.username}`);
    next();
  } catch (error) {
    console.error('✗ خطأ في التحقق من التوكن:', error.message);

    let message = 'التوكن غير صالح';
    if (error.name === 'TokenExpiredError') {
      message = 'انتهت صلاحية التوكن';
    }

    return res.status(401).json({
      success: false,
      message
    });
  }
}

// Export الدوال
module.exports = {
  registerUser,
  loginUser,
  verifyToken
};
