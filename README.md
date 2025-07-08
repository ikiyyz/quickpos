# 🛒 Next-POS (Point of Sale System)

A modern and user-friendly Point of Sale system built with Node.js, Express, and PostgreSQL.

![POS System](https://img.shields.io/badge/Status-Development-orange)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)
![Express](https://img.shields.io/badge/Express-4.16+-yellow)

## ✨ Features

### 🏪 **Core POS Features**
- 📦 **Product Management** - Add, edit, and manage products with images
- 🛍️ **Sales Processing** - Quick and easy sales transactions
- 📋 **Purchase Management** - Track inventory purchases from suppliers
- 👥 **Customer Management** - Manage customer information
- 🏢 **Supplier Management** - Track supplier details and transactions

### 📊 **Business Intelligence**
- 📈 **Dashboard Analytics** - Visual charts and reports
- 📊 **Sales Reports** - Comprehensive sales analysis
- 📦 **Inventory Tracking** - Real-time stock management
- 💰 **Financial Overview** - Revenue and expense tracking

### 🔐 **Security & User Management**
- 👤 **User Authentication** - Secure login system
- 🔒 **Role-based Access** - Different user permissions
- 🔐 **Password Encryption** - Secure password storage
- 📱 **Session Management** - Secure user sessions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd next-pos
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure database**
```bash
# Copy config example and update with your database credentials
cp config/config.json.example config/config.json
```

4. **Run migrations**
```bash
npx sequelize-cli db:migrate
```

5. **Seed sample data (optional)**
```bash
npx sequelize-cli db:seed:all
```

6. **Start the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

7. **Access the application**
```
http://localhost:3000
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **PostgreSQL** | Database |
| **Sequelize** | ORM |
| **EJS** | Template engine |
| **Bootstrap 4** | UI framework |
| **Chart.js** | Data visualization |
| **DataTables** | Interactive tables |

## 📁 Project Structure

```
next-pos/
├── 📁 models/          # Database models
├── 📁 routes/          # API routes
├── 📁 views/           # EJS templates
├── 📁 migrations/      # Database migrations
├── 📁 public/          # Static assets
├── 📁 config/          # Configuration files
└── 📁 helpers/         # Utility functions
```

## 🎯 Key Modules

- **Dashboard** - Overview and analytics
- **Products** - Inventory management
- **Sales** - Transaction processing
- **Purchases** - Supplier transactions
- **Customers** - Customer database
- **Suppliers** - Supplier management
- **Users** - User administration

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pos_db
DB_USER=your_username
DB_PASS=your_password
```

### Database Setup
1. Create a PostgreSQL database
2. Update `config/config.json` with your database credentials
3. Run migrations to create tables

## 📸 Screenshots

*Screenshots will be added as the project progresses*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- 📧 Create an issue on GitHub
- 📖 Check the documentation
- 💬 Join our community discussions

## 🎉 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by real-world POS requirements
- Designed for small to medium businesses

---

**⭐ Star this repository if you find it helpful!**

**🔄 This project is actively under development. New features are being added regularly!** 