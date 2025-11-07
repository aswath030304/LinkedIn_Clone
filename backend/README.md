# Backend – LinkedIn Clone

This is the **Node.js + Express.js** backend for the **LinkedIn Clone** project.
It powers the application with authentication, post management, user profiles, and image uploads via **Cloudinary**, all backed by **MongoDB Atlas**.

---

##  Tech Stack

* **Node.js + Express.js** – RESTful backend framework
* **MongoDB Atlas + Mongoose** – Cloud database
* **JWT (JSON Web Token)** – Secure user authentication
* **Cloudinary** – Image upload and storage
* **dotenv + cors** – Environment and cross-origin configuration

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── cloudinary.js           # Cloudinary configuration
│
├── middleware/
│   └── authMiddleware.js       # Authentication middleware (JWT)
│
├── models/
│   ├── Comment.js              # Comment schema
│   ├── Post.js                 # Post schema
│   └── User.js                 # User schema
│
├── routes/
│   ├── auth.js                 # Login & signup routes
│   ├── post.js                 # Create, view, like, comment posts
│   ├── profile.js              # View & update profile
│   ├── upload.js               # Cloudinary image upload route
│   └── users.js                # Search & fetch users
│
├── uploads/                    
├── server.js                   # Entry point for backend server
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

##  Environment Variables

Your `.env` file should be created in the `backend/` directory and include:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

>  **Important:** Never push `.env` to GitHub.
> MongoDB Atlas credentials and Cloudinary keys are private.

---

## How to Run

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the development server

```bash
npm start
```

By default, the backend runs on:

```
http://localhost:5000
```

If connected successfully, you’ll see logs like:

```
✅ MongoDB Connected Successfully
✅ Server running on port 5000
```

---

##  API Endpoints

| Method   | Endpoint                 | Description                |
| -------- | ------------------------ | -------------------------- |
| **POST** | `/api/auth/signup`       | Register a new user        |
| **POST** | `/api/auth/login`        | Login existing user        |
| **GET**  | `/api/posts`             | Get all posts              |
| **POST** | `/api/posts`             | Create new post            |
| **POST** | `/api/posts/:id/comment` | Add comment to a post      |
| **GET**  | `/api/profile/:id`       | Fetch user profile         |
| **PUT**  | `/api/profile/:id`       | Update profile details     |
| **POST** | `/api/upload`            | Upload image to Cloudinary |
| **GET**  | `/api/users/search`      | Search for users           |

---

##  MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a **free cluster**
3. In *Database Access*, create a database user with password access
4. In *Network Access*, allow access from your IP (`0.0.0.0/0` for all IPs)
5. Copy your connection string:

   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/LinkedInClone
   ```
6. Paste it into your `.env` as:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/LinkedInClone
   ```

---

##  Deployment (Render or )

###  On Render

* Go to **Render → New Web Service**
* Connect your GitHub repo
* Add these environment variables under “Environment”
* Set build command: `npm install`
* Set start command: `node server.js`
* Deploy 🎉

---

## 👨‍💻 Author

**Aswath [@aswath030304](https://github.com/aswath030304)**
Backend built with  Node.js, MongoDB Atlas & Cloudinary.
