# 🏡 Shelter Seeker

**Shelter Seeker** is a modern, full-featured **Real Estate Online Marketplace** built using the **MERN Stack** (MongoDB, Express.js, React, and Node.js). It allows users to explore, list, and manage property listings, providing a seamless and user-friendly experience.

---

## 🚀 Features
✅ **User Authentication**  
- Secure login and signup using **JWT (JSON Web Tokens)**  
- Password encryption using **bcrypt.js**  

✅ **Listings Management**  
- Create, update, and delete property listings  
- View property details with images and descriptions  

✅ **Advanced Search & Filters**  
- Search by location, price range, and property type  
- Filter results based on user preferences  

✅ **Real-Time Updates**  
- Instant updates on property availability and status  
- Efficient state management using **Redux Toolkit**  

✅ **Image Upload**  
- Upload property images using **Firebase Storage**  

✅ **User Dashboard**  
- Manage your listings and track property activity  

---

## 🏗️ Tech Stack
| Technology | Description |
|-----------|-------------|
| **MongoDB** | NoSQL database for storing user and property data |
| **Express.js** | Backend framework for handling API requests |
| **React** | Frontend framework for building user interfaces |
| **Node.js** | Backend runtime for handling server-side logic |
| **Redux Toolkit** | State management for handling global state |
| **Firebase** | Storage for property images |

---

## 📸 Screenshots
| Home Page | Listings Page | Property Details |
|-----------|---------------|------------------|
| ![Home Page](path/to/homepage-screenshot.png) | ![Listings](path/to/listings-screenshot.png) | ![Details](path/to/details-screenshot.png) |

---

## ⚙️ Installation
1. **Clone the repository**  
```bash
git clone https://github.com/your-username/shelter-seeker.git
cd shelter-seeker

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install

MONGO = ""
JWT_SECRET = ""
VITE_FIREBASE_API_KEY = ""
# Start backend
npm run server

# Start frontend
cd client
npm start

