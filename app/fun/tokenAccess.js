import Cookies from "js-cookie";

const jwt = require("jsonwebtoken");
export function checkTokenExpiration() {
  const token = Cookies.get("authToken");
  if (!token) {
    // إذا لم يكن هناك Token، توجيه المستخدم لتسجيل الدخول
    window.location.href = "/loginPage";
    return;
  }

  const decodedToken = jwt.decode(token); // فك تشفير الـ Token (بدون التحقق من التوقيع)
  if (decodedToken.exp * 1000 < Date.now()) {
    // إذا انتهت صلاحية الـ Token
    Cookies.remove("authToken"); // مسح الـ Token القديم
    window.location.href = "/loginPage"; // توجيه المستخدم لتسجيل الدخول
  }
}
