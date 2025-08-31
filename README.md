# StorePulse – Modern Rating & Review Platform

🚀 **StorePulse** is a full-stack web application that allows users to discover stores, submit ratings & reviews, reply to reviews, and manage stores based on their role.  
It is designed as a **Single Page Application (SPA)** for smooth navigation and enhanced user experience.

## 🌐 Live Demo
Frontend: [Render Deployment (Static Site)](your-frontend-link)  
Backend API: [Render Deployment (Service)](your-backend-link)  
*(Links are also in the repository description)*

---

## 🛠️ Tech Stack

**Frontend**:  
- [React.js](https://reactjs.org/) – SPA with reusable components  
- [Redux Toolkit](https://redux-toolkit.js.org/) – For global state management (useful as app scales)  
- Bootstrap + Custom CSS – For UI  

**Backend**:  
- [Node.js](https://nodejs.org/)  
- [Express.js](https://expressjs.com/) – REST APIs  
- [Knex.js](http://knexjs.org/) – Query builder  

**Database**:  
- [PostgreSQL (NeonDB)](https://neon.tech/) – Cloud database  
- Optimized with **indexes** for faster search on name, email, address, and role  

**Authentication & Security**:  
- JWT (JSON Web Tokens) for secure sessions  
- HttpOnly Cookies to prevent XSS attacks  

**Deployment**:  
- **Render**: Backend deployed as a **separate web service**, Frontend as **static web app**  
  - ✅ Better scalability  
  - ✅ Independent versioning  
  - ✅ Faster builds & updates  

---

## 👥 User Roles & Functionalities

### 🔑 System Administrator
- Only **one active System Admin** at a time  
- Manage users (add/remove admins, store owners, normal users)  
- Dashboard showing:  
  - Total users  
  - Total stores  
  - Total ratings  
- Change password & edit details  
- Advanced filtering on users & stores  

### 🛡️ Admin
- Same permissions as **System Admin** for managing:
  - Users (except system admin privileges)
  - Stores
  - Ratings & reviews
- **Cannot**:
  - Promote/demote another user to/from `admin`
  - Assign or remove `system_admin`
- Can access the **Admin Dashboard**:
  - View/manage all stores, users, and reviews
  - Apply filters & search on users/stores
- Can edit their own profile and change password


### 👤 Normal User
- Sign up & log in  
- Submit **one rating & review per store**  
- Can edit or delete their review anytime  
- Allowed multiple **replies** to reviews (but replies don’t carry ratings)  
- Can like/dislike stores  
- Can filter stores by:  
  - High → Low rating  
  - Low → High rating  
  - Category (restaurant, electronics, etc.)  
- Without login → can only **view website**, not interact  

### 🏪 Store Owner
- Dashboard showing:  
  - List of users who reviewed their store  
  - Average rating of the store  
- Edit details & update password  

---

## ⭐ Features
- Modern **SPA experience** with React  
- **JWT + HttpOnly cookies** for secure login  
- **Review & Reply System**:  
  - Users can post 1 review per store  
  - Multiple replies allowed (no ratings for replies)  
  - Average rating displayed on store cards (top-right)  
- **Reactions**: Like/Dislike stores  
- **Admin Dashboard**: Accessible only to admins/system admin  
- **Filters & Search**: Search stores by name/address, filter by category or ratings  
- **Store Details Page**:  
  - Reviews & replies section  
  - Store location (Google Maps embed)  
  - Store owner details  

---

## 🗄️ Database Schema

The database ensures **data integrity, performance, and consistency**:

### 🔹 Users Table
- Roles: `system_admin`, `admin`, `store_owner`, `normal_user`  
- Unique email & username constraints  
- Indexed on name, email, role for fast lookups  

### 🔹 Stores Table
- Linked with `users.owner_id`  
- Indexed for fast search by name & address  
- **ON DELETE CASCADE** → when an owner is removed, their stores are also removed  

### 🔹 Ratings Table
- Stores both reviews and replies (`parent_review_id`)  
- Enforces **one unique review per user per store** (constraint)  
- **ON DELETE CASCADE** → deleting a review deletes its replies  

### 🔹 Store Reactions Table
- Stores like/dislike per user per store (unique constraint)  

---

## ⚡ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/StorePulse-Modern-Rating-Review-Platform.git
   cd StorePulse-Modern-Rating-Review-Platform

