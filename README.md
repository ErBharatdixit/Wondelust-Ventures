# 🌍 Wanderlust - Your Ultimate Travel Companion

![Wanderlust Banner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80)

> **Discover, Book, and Experience the World's Best Stays.**

Wanderlust is a full-stack MERN application that connects travelers with unique accommodations around the globe. Whether you're looking for a cozy cottage, a beachfront villa, or a modern city apartment, Wanderlust makes it easy to find and book your perfect getaway.

---

## ✨ Key Features

### 🔐 **Secure Authentication & User Profiles**
- **Robust Auth System:** Secure Signup and Login using Passport.js with local strategy.
- **Email Verification:** OTP-based email verification via Nodemailer to ensure genuine users.
- **User Profiles:** Personalized profiles to manage listings, bookings, and reviews.

### 🏠 **Comprehensive Listing Management**
- **Create & Edit:** Users can easily host their properties by adding detailed listings with images, descriptions, and amenities.
- **Cloud Storage:** Seamless image uploads and storage using **Cloudinary**.
- **Interactive Maps:** Pinpoint location accuracy with **Leaflet** maps integration.

### 🔍 **Smart Search & Discovery**
- **Advanced Filtering:** Find exactly what you need with category-based filtering (e.g., Trending, Beachfront, Iconic Cities).
- **Favorites:** Save your dream destinations to your "Favorites" list for quick access.

### 💬 **Real-Time Communication**
- **Live Chat:** Integrated messaging system allowing hosts and guests to communicate in real-time.
- **Inbox:** Centralized inbox to manage all your conversations.

### 📅 **Booking & Payments**
- **Seamless Booking:** Easy-to-use booking interface for reserving dates.
- **Secure Payments:** Integrated **Razorpay** payment gateway for safe and secure transactions.
- **Booking Management:** View and manage your upcoming and past trips in "My Bookings".

### ⭐ **Reviews & Community**
- **Ratings & Reviews:** Share your experiences and read reviews from other travelers to make informed decisions.
- **Community Trust:** Built-in validation to ensure reviews are authentic.

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Dynamic and responsive UI library |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white) | Next-generation frontend tooling |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Utility-first CSS framework for stunning designs |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | Declarative routing for React |
| **Leaflet** | Interactive maps for listing locations |
| **React Hot Toast** | Beautiful notifications for user feedback |

### **Backend**
| Technology | Description |
| :--- | :--- |
| ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) | JavaScript runtime environment |
| ![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) | Fast, unopinionated web framework for Node.js |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) | NoSQL database for flexible data storage |
| **Passport.js** | Authentication middleware for Node.js |
| **Cloudinary** | Cloud-based image and video management |
| **Nodemailer** | Module for sending emails |
| **Razorpay** | Payment gateway integration |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Razorpay Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/wanderlust.git
    cd wanderlust
    ```

2.  **Install Backend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd client
    npm install
    cd ..
    ```

4.  **Environment Configuration**
    Create a `.env` file in the root directory and add the following:
    ```env
    CLOUD_NAME=your_cloud_name
    CLOUD_API_KEY=your_api_key
    CLOUD_API_SECRET=your_api_secret
    MAP_TOKEN=your_map_token
    ATLASDB_URL=your_mongodb_url
    SECRET=your_session_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    EMAIL_USER=your_email_address
    EMAIL_PASS=your_email_password
    ```

5.  **Run the Application**
    You can run both backend and frontend concurrently (if configured) or in separate terminals.

    **Backend:**
    ```bash
    node app.js
    ```

    **Frontend:**
    ```bash
    cd client
    npm run dev
    ```

6.  **Visit the App**
    Open your browser and go to `http://localhost:5173` (or the port specified by Vite).

---

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/yourusername">Bharat Dixit</a>
</p>
