# Social Media Platform

A modern, secure, and scalable social media platform built with Node.js, Express, and MongoDB. This application provides a robust backend for social networking with features like user authentication, profile management, content sharing, and real-time interactions.

## 🚀 Features

- 🔐 **Secure Authentication**
  - JWT-based authentication
  - Google OAuth 2.0 integration
  - Role-based access control
  - Rate limiting and security headers

- 👥 **User Management**
  - User registration and profile management
  - Email verification
  - Password reset functionality
  - Profile picture uploads using Cloudinary

- 📱 **Core Features**
  - Create and share posts
  - Like and comment on posts
  - Follow/Unfollow users
  - Real-time notifications
  - Secure file uploads

- 🛡️ **Security**
  - XSS protection
  - Input validation using Joi
  - Helmet.js for securing HTTP headers
  - Rate limiting to prevent abuse

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google OAuth 2.0
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, xss-clean, express-rate-limit
- **Validation**: Joi
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for file storage)
- Google OAuth 2.0 credentials

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd social-media
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 API Documentation

For detailed API documentation, please refer to the [API Documentation](API_DOCS.md) file.

## 🧪 Testing

To run tests:
```bash
npm test
```

## 🧰 Project Structure

```
social-media/
├── dist/                 # Compiled TypeScript files
├── node_modules/         # Dependencies
├── src/                  # Source code
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [JWT](https://jwt.io/)
- [Cloudinary](https://cloudinary.com/)

## 📧 Contact

For any inquiries, please contact [Your Email] or open an issue on the repository.
