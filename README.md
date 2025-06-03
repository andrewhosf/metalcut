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
- Git
- MongoDB (for production)

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

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Running the Application

### Development Mode
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

### Production Mode
1. Build the frontend:
```bash
cd client
npm run build
cd ..
```

2. Start the production server:
```bash
npm start
```

## Version Management

This project uses Semantic Versioning (MAJOR.MINOR.PATCH) and maintains a detailed changelog. Here's how to manage versions:

### Version Types
- **MAJOR** (1.0.0): Breaking changes that require user action
- **MINOR** (0.1.0): New features that are backwards compatible
- **PATCH** (0.0.1): Bug fixes that are backwards compatible

### Version Commands
```bash
# For new features (increases MINOR version)
npm run release:minor

# For bug fixes (increases PATCH version)
npm run release:patch

# For breaking changes (increases MAJOR version)
npm run release:major
```

### Changelog
All changes are documented in `CHANGELOG.md`. The changelog follows the [Keep a Changelog](https://keepachangelog.com/) format and includes:
- Added features
- Changed functionality
- Fixed bugs
- Breaking changes

### Version Script
The version script (`scripts/version.js`) automatically:
1. Updates the version in package.json
2. Updates CHANGELOG.md
3. Creates a git tag
4. Commits the changes

## Development Workflow

### Git Workflow
1. Create a new branch for each feature/fix:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

2. Follow the commit message convention:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

### Code Quality
- Run linting:
```bash
npm run lint
```

- Run tests:
```bash
npm test
```

- Check code coverage:
```bash
npm run test:coverage
```

### Pull Request Process
1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md with your changes
3. Ensure all tests pass
4. Update the documentation if needed
5. Create a pull request with a clear description

## Project Structure

```
metalcut/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main application component
├── server/                # Backend server
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── scripts/             # Build and utility scripts
├── tests/              # Test files
├── uploads/            # Temporary file storage
├── .env.example        # Example environment variables
├── .gitignore         # Git ignore rules
├── CHANGELOG.md       # Version history
├── server.js          # Express backend server
└── package.json       # Project dependencies
```

## API Documentation

### Endpoints

#### File Upload
- `POST /api/upload`
  - Upload STL/STEP files
  - Returns file metadata and initial cost estimate

#### Cost Calculation
- `POST /api/calculate-cost`
  - Calculate project costs
  - Parameters:
    - material: string
    - thickness: number
    - quantity: number
  - Returns detailed cost breakdown

#### Quote Management
- `GET /api/quotes`
  - Get user's quote history
- `POST /api/quotes`
  - Create new quote
- `GET /api/quotes/:id`
  - Get specific quote details

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- End-to-end tests: `tests/e2e/`

## Deployment

### Production Build
1. Set environment variables
2. Build frontend:
```bash
cd client
npm run build
```

3. Start production server:
```bash
npm start
```

### Docker Deployment
```bash
# Build the image
docker build -t metalcut .

# Run the container
docker run -p 3000:3000 -p 5000:5000 metalcut
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Guidelines
- Update documentation for any new features
- Add tests for new functionality
- Ensure all tests pass
- Follow the existing code style
- Update the CHANGELOG.md

## Troubleshooting

### Common Issues
1. **File Upload Fails**
   - Check file size limits
   - Verify file format
   - Check server logs

2. **Cost Calculation Errors**
   - Verify input parameters
   - Check material database
   - Review server logs

### Getting Help
- Check the [issues page](https://github.com/yourusername/metalcut/issues)
- Review the documentation
- Contact the maintainers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) for 3D model processing
- [Material-UI](https://mui.com/) for the UI components
- [Express.js](https://expressjs.com/) for the backend framework 