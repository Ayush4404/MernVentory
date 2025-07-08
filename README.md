

### 📁 `README.md`

````markdown
# 🛒 MERNventory - Inventory Management System

MERNventory is a full-stack inventory management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to register, manage products, track inventory, and perform CRUD operations, complete with user authentication and image uploads.

## 🚀 Features

- ✅ User registration and login
- 🔐 Protected routes using JWT and cookies
- 👤 Profile view & update
- 🧾 Add, update, delete, and preview products
- 📊 Dashboard with inventory statistics (total products, out-of-stock, total value, categories)
- 🖼️ Product image upload using Multer
- 🔄 Password reset via email with token
- 🌌 Spline 3D animated background
- 🎨 Modern UI with Tailwind CSS

---

## 🧪 Tech Stack

| Frontend         | Backend           | Database        | Tools & Other     |
|------------------|-------------------|------------------|-------------------|
| React.js         | Node.js           | MongoDB Atlas    | Multer (file upload) |
| Vite             | Express.js        | Mongoose         | JWT (Auth)        |
| Tailwind CSS     | Bcrypt            |                  | dotenv, cookie-parser |
| React Icons      | Nodemailer        |                  | Spline 3D         |

---

## 🛠️ Installation & Setup

### 📦 Backend

1. Go to the `backend` folder:

```bash
cd backend
npm install
````

2. Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:5173
```

3. Start the backend server:

```bash
npm run dev
```

### 🌐 Frontend

1. Go to the `frontend` folder:

```bash
cd frontend
npm install
```

2. Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000
```

3. Run the frontend:

```bash
npm run dev
```

---

## 📸 Folder Structure

```
frontend/
│
├── components/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   └── DashboardWrapper.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── AddProduct.jsx
│   ├── EditProduct.jsx
│   └── Dashboard.jsx
└── main.jsx
```

```
backend/
│
├── controllers/
│   ├── userController.js
│   └── productController.js
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   └── tokenModel.js
├── routes/
│   ├── userRoute.js
│   └── productRoute.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── upload.js
└── server.js
```

---

## 🌍 Deployment

### Frontend (Vercel or Netlify)

* Connect your GitHub repo and set the `VITE_BACKEND_URL` as an environment variable.
* Deploy using **Vite** framework settings.

### Backend (Render or Railway)

* Upload the backend folder.
* Add all `.env` variables.
* Make sure `uploads/` folder is created for image storage.

---

## 🤝 Contributors

* \[Ayush Rawat] - Full Stack Developer

---

## 📜 License

MIT License. Feel free to use, modify, and share!

---

## 📧 Contact

Need help or want to contribute?

* Email: [your-email@example.com](mailto:ayushrawat4404@gmail.com)


