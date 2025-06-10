# MediLink – Doctor Appointment & Diagnosis System

![MediLink](https://github.com/user-attachments/assets/d5fb955d-8cb0-430e-8cc2-89ea76ba852a)


MediLink is a full-stack web platform designed to streamline doctor appointments, diagnosis tracking, and patient-doctor interactions. It offers a robust admin dashboard, secure authentication, image uploads, and online payments — all in one place.

## Features

- Book and manage doctor appointments  
- Online payments with Stripe  
- Doctors can issue diagnoses and prescribe medication  
- Admin control panel for managing users, doctors, and appointments  
- Patient medical history tracking  


## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Databases:** MySQL (SQL)  
- **Authentication:** JWT  
- **Cloud Storage:** Cloudinary  
- **Payments:** Stripe  

## Installation

1. Clone the repository  
    ```bash
    git clone https://github.com/AdhurimBerisha51865/MediLink-Lende-Laboratorike-2-.git
    ```

2. Install dependencies for frontend and backend  
    ```bash
    cd client
    npm install

    cd api
    npm install
    ```

3. Set up environment variables (see below)

4. Run the development servers  
    ```bash
    # api
    npm run server

    # client
    npm run dev
    ```

## Environment Variables

This project requires a few environment variables to run properly.

- For the **api**, create a `.env` file.  
- For the **client**, create a `.env` file.

### api `.env` variables include:

- `CLOUDINARY_NAME` — your_cloud_name
- `CLOUDINARY_API_KEY` — your_api_key
- `CLOUDINARY_SECRET_KEY` — your_api_secret
- `ADMIN_EMAIL` — your_admin_email
- `ADMIN_PASSWORD` — your_admin_password
- `JWT_SECRET` — your_jwt_secret
- `FRONTEND_URL` — http://localhost:5173
- `STRIPE_SECRET_KEY` — your_stripe_secret_key

- `MYSQL_HOST` — your_mysql_host
- `MYSQL_USER` — your_mysql_user
- `MYSQL_PASSWORD` — your_mysql_password
- `MYSQL_DB` — your_mysql_database

### client `.env` variables include:
- `VITE_BACKEND_URL` — http://localhost:4000
- `VITE_STRIPE_PUBLISHABLE_KEY` — your_stripe_publishable_key

