# LinkedIn Clone – Full Stack Developer Internship (AppDost)

A **Full Stack LinkedIn Clone** web application built as part of the **AppDost Full Stack Developer Internship Assignment**.
The project demonstrates complete frontend–backend integration, user authentication, post creation, and a responsive UI using **React.js, Node.js, Express, and MongoDB Atlas**.

---

##  Project Overview

This is a simple social media web app inspired by LinkedIn where users can:

* Register and log in securely
* Create posts (with text or images)
* View a feed of all user posts
* Like, comment, and manage their profile


---

## ⚙️ Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| **Frontend**       | React.js (Vite) + Tailwind CSS                  |
| **Backend**        | Node.js + Express.js                            |
| **Database**       | MongoDB Atlas (Cloud)                           |
| **Authentication** | JWT (JSON Web Tokens)                           |
| **Image Hosting**  | Cloudinary                                      |
| **Deployment**     | Frontend on Vercel / Netlify, Backend on Render |

---

## Folder Structure

```
LinkedIn_Clone/
│
├── frontend/            # React + Vite + Tailwind CSS app
│   ├── src/
│   │   ├── components/  # Navbar, ScrollToTop, PostCard, etc.
│   │   ├── pages/       # Login, Signup, Feed, Profile, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.css
│   └── README.md
│
├── backend/             # Node.js + Express + MongoDB API
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── README.md
│
└── README.md            # Main project documentation
```

---

##  Key Features

✅ **User Authentication** – Signup & Login with JWT-based sessions
✅ **Create Post** – Users can share posts with text or images
✅ **Public Feed** – Displays all users’ posts (latest first)
✅ **Profile Section** – View and update user profile
✅ **Comment System** – Add comments on posts
✅ **Like Feature (Optional)** – Like/unlike posts
✅ **Responsive Design** – Fully mobile and desktop compatible
✅ **Cloudinary Integration** – For image uploads

---

##  Environment Variables

### In `/backend/.env`

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

>  Do not commit `.env` to GitHub.

---

##  How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/aswath030304/LinkedIn_Clone.git
cd LinkedIn_Clone
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

Backend runs at → `http://localhost:5000`

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

>  **Important for Local Testing:**  
> Before running the project locally, make sure you **change all API URLs** in your frontend files  
> (for example in `profile.jsx`, `navbar.js`, or anywhere API calls are made)  
> from your production backend:
> ```
> https://linkedin-clone-4qcp.onrender.com/
> ```
> to your local backend:
> ```
> http://localhost:5000/
> ```
> This ensures the frontend connects to your local Express server instead of the deployed one.  
> After testing, you can switch it back to your production URL before deployment.


---

##  MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a **free cluster**
3. Create a database user (with username/password)
4. Allow access from all IPs (`0.0.0.0/0`)
5. Copy the connection string:

   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/LinkedInClone
   ```
6. Paste it into `.env` under `MONGO_URI`

---

##  Deployment

###  Backend (Render)

1. Go to [Render](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repo
4. Add `.env` variables under Environment
5. Build command: `npm install`
6. Start command: `node server.js`

###  Frontend (Vercel or Netlify)

1. Deploy `frontend/` folder
---

##  API Overview

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| POST   | `/api/auth/signup`       | Register new user          |
| POST   | `/api/auth/login`        | Login user                 |
| GET    | `/api/posts`             | Fetch all posts            |
| POST   | `/api/posts`             | Create a new post          |
| POST   | `/api/posts/:id/comment` | Add comment to post        |
| GET    | `/api/profile/:id`       | Get user profile           |
| PUT    | `/api/profile/:id`       | Update profile             |
| POST   | `/api/upload`            | Upload image to Cloudinary |
| GET    | `/api/users/search`      | Search users               |

---

##  Assignment Reference (AppDost)

> **Assignment Requirements**
>
> * Signup/Login system ✅
> * Create and view posts ✅
> * Public feed ✅
> * Responsive UI ✅
> * Optional: Like, comment, edit post ✅

---

##  Author

**Aswath [@aswath030304](https://github.com/aswath030304)**
Frontend built with React + Vite + Tailwind CSS
Backend built with Node.js + Express + MongoDB Atlas + Cloudinary

---

##  Live Links

*  **Frontend:** [Deployed Frontend Link](https://connectifyin.vercel.app/)
*  **Backend:** [[Deployed Backend API](https://linkedin-clone-4qcp.onrender.com/)]
*  **GitHub Repo:** [https://github.com/aswath030304/LinkedIn_Clone](https://github.com/aswath030304/LinkedIn_Clone)
