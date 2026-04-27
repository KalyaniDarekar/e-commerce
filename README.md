# ElectroStore — E-Commerce Application

A full-stack electronics e-commerce application built with **React** (Vite) and **Node.js** (Express + MongoDB).

## Project Structure

```
e-commerce/
├── backend/                # Node.js + Express API
│   ├── config/             # Database & app configuration
│   │   └── db.js           # MongoDB connection logic
│   ├── middleware/          # Auth & validation middleware
│   ├── models/             # Mongoose schemas
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/             # Express route handlers
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── .env.example        # Environment variable template
│   ├── package.json
│   ├── seeder.js           # Database seeder script
│   └── server.js           # Application entry point
│
├── frontend/               # React + Vite SPA
│   ├── src/
│   │   ├── admin/          # Admin panel components
│   │   ├── components/     # Shared UI components
│   │   ├── pages/          # Page-level components
│   │   ├── store/          # Redux store & slices
│   │   ├── utils/          # Utility functions (API config)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example        # Frontend env template
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd backend
cp .env.example .env        # Create .env and fill in your values
npm install
npm run dev                  # Starts with nodemon (hot-reload)
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env        # Create .env
npm install
npm run dev                  # Starts Vite dev server
```

## Environment Variables

### Backend (`backend/.env`)
| Variable       | Description                        |
| -------------- | ---------------------------------- |
| `PORT`         | Server port (default: 5000)        |
| `MONGO_URI`    | MongoDB Atlas connection string    |
| `NODE_ENV`     | `development` or `production`      |
| `FRONTEND_URL` | Frontend origin URL (for CORS)     |

### Frontend (`frontend/.env`)
| Variable            | Description                          |
| ------------------- | ------------------------------------ |
| `VITE_BACKEND_URL`  | Backend API URL (default: http://localhost:5000) |

## Tech Stack
- **Frontend:** React 18, Redux Toolkit, React Router, Framer Motion, TailwindCSS
- **Backend:** Node.js, Express, Mongoose, JWT, Multer
- **Database:** MongoDB Atlas