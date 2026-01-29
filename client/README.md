# Luxury Watch Store Admin Dashboard

Welcome to the Luxury Watch Store Admin Dashboard project! This project is designed to provide an intuitive and responsive interface for managing various aspects of the luxury watch store.

## Project Structure

The project is organized as follows:

```
client
├── src
│   ├── app
│   │   └── admin
│   │       ├── layout.tsx          # Main layout for admin pages
│   │       ├── page.tsx            # Entry point for admin section
│   │       ├── products
│   │       │   └── page.tsx        # Products management page
│   │       ├── orders
│   │       │   └── page.tsx        # Orders management page
│   │       ├── customers
│   │       │   └── page.tsx        # Customers management page
│   │       └── settings
│   │           └── page.tsx        # Settings management page
│   ├── components
│   │   └── admin
│   │       ├── AdminSidebar.tsx     # Sidebar component for admin navigation
│   │       └── AdminHeader.tsx      # Header component for admin dashboard
│   ├── styles
│   │   └── globals.css              # Global CSS styles
│   └── types
│       └── index.ts                 # TypeScript types and interfaces
├── package.json                     # NPM configuration file
├── tsconfig.json                    # TypeScript configuration file
├── tailwind.config.js               # Tailwind CSS configuration file
├── postcss.config.js                # PostCSS configuration file
└── README.md                        # Project documentation
```

## Features

- **Admin Sidebar**: A fixed sidebar for easy navigation between different sections of the admin dashboard, including Dashboard, Products, Orders, Customers, and Settings.
- **Responsive Design**: The layout adapts to various screen sizes, ensuring a seamless experience on both desktop and mobile devices.
- **Lightweight and Fast**: Built with React and Tailwind CSS for optimal performance.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd client
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the admin dashboard.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.