# Frontend – LinkedIn Clone

This is the **React.js (Vite)** frontend of the LinkedIn Clone application.
It replicates key features of LinkedIn’s feed and profile experience with a responsive modern UI built using **Tailwind CSS**.

---

##  Tech Stack

* **React.js + Vite** – Fast and optimized frontend build tool
* **Tailwind CSS** – Utility-first CSS framework
* **Axios** – For API requests
* **React Router DOM** – For page navigation
* **Lucide React Icons** – For icons
* **Custom Components** – Navbar, ScrollToTop, PostCard.

---

## 📁 Folder Structure

```
src/
├── assets/              
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── ScrollToTop.jsx
│   ├── PostCard.jsx
├── pages/               # All main screens
│   ├── CreatePost.jsx
│   ├── Feed.jsx
│   ├── Forgotpassword.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── PostWithComments.jsx
│   ├── Profile.jsx
│   ├── SearchPage.jsx
│   ├── Signup.jsx
│   └── UserProfile.jsx
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

##  How to Run

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the development server

```bash
npm run dev
```

The app will run by default on **[http://localhost:5173](http://localhost:5173)**

---

##  Backend Connection

Make sure your backend  is running before using the frontend.
In your API calls (like in Axios), update the base URL to match your deployed or local backend:

```js
const API_URL = "http://localhost:5000/api";
```

---

##  Features

*  **Authentication Pages**: Login, Signup, and Forgot Password
*  **Feed Page**: View and interact with all posts
*  **Create Post**: Add new posts with text/images
*  **Post with Comments and Likes**: View post details comments and likes
*  **Profile & User Profile**: View and edit user information
*  **Search Page**: Find users or posts
*  **Navbar & Scroll-to-Top**: Smooth navigation and scroll experience
*  **Fully Responsive UI** built with Tailwind CSS

---

##  Developer Notes


  ```
  VITE_API_BASE_URL=http://localhost:5000
  ```
* When deploying, make sure to update this value to your backend’s hosted URL.

---

##  Author

**Aswath N [@aswath030304](https://github.com/aswath030304)**
Frontend built with  using React + Vite + Tailwind CSS.
