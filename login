cURL Command:
=============
curl -X POST "http://localhost:5000/customer/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser2026", "password":"secure123"}'

Output:
=======
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3Nzk0NjA1NzM2NzYsInVzZXJuYW1lIjoibmV3dXNlcjIwMjYiLCJpYXQiOjE3Nzk0NjA2NzAsImV4cCI6MTc3OTQ2NDI3MH0.WTFI4osZf782Gts9ZQOYdm1TpGphQ34T6VOwtvePljQ",
  "username": "newuser2026"
}
