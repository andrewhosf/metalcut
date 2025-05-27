# MetalCut - Metal Cutting Cost Estimation Platform

MetalCut is a web application that helps users estimate costs for metal cutting projects by analyzing 3D models (STL/STEP files) and calculating material, labor, and machine costs.

## Features

- Secure file upload system for STL and STEP files
- Material and thickness analysis
- Cost calculation based on material, thickness, and quantity
- Quote history tracking
- Modern, responsive user interface

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/metalcut.git
cd metalcut
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
metalcut/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.js         # Main application component
├── server.js              # Express backend server
├── uploads/              # Temporary file storage
└── package.json          # Project dependencies
```

## API Endpoints

- `POST /api/upload` - Upload STL/STEP files
- `POST /api/calculate-cost` - Calculate project costs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 