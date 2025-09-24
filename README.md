# ArtMart API

A RESTful API for managing art pieces built with Node.js and Express.js. This API provides full CRUD (Create, Read, Update, Delete) operations for art management and is ready for deployment on AWS EC2.

## Features

- ✅ RESTful API with full CRUD operations
- ✅ Input validation and error handling
- ✅ Filtering and sorting capabilities
- ✅ Security middleware (Helmet, CORS)
- ✅ Request logging with Morgan
- ✅ AWS EC2 deployment ready
- ✅ In-memory data storage (ready to be replaced with a database)

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
```
GET /health
```

### Arts Management

#### Get All Arts
```
GET /api/arts
```

**Query Parameters:**
- `category` - Filter by art category (painting, sculpture, photography, digital, mixed-media, other)
- `artist` - Filter by artist name (partial match)
- `available` - Filter by availability (true/false)
- `sortBy` - Sort by field (createdAt, updatedAt, title, artist, year, price)
- `order` - Sort order (asc, desc)

**Example:**
```bash
GET /api/arts?category=painting&sortBy=year&order=asc
```

#### Get Single Art
```
GET /api/arts/:id
```

#### Create New Art
```
POST /api/arts
```

**Request Body:**
```json
{
    "title": "Art Title",
    "artist": "Artist Name",
    "year": 2023,
    "medium": "Oil on canvas",
    "price": 50000,
    "description": "Art description",
    "category": "painting",
    "dimensions": "100cm x 80cm",
    "isAvailable": true
}
```

**Required Fields:**
- `title` (string)
- `artist` (string)

#### Update Art
```
PUT /api/arts/:id
```

**Request Body:** (partial update supported)
```json
{
    "price": 60000,
    "description": "Updated description"
}
```

#### Delete Art
```
DELETE /api/arts/:id
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Local Development

1. **Clone the repository:**
```bash
git clone <repository-url>
cd artmart-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Start production server:**
```bash
npm start
```

The API will be running on `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
PORT=3000
NODE_ENV=production
```

## Data Schema

### Art Object
```json
{
    "id": "string (UUID)",
    "title": "string (required)",
    "artist": "string (required)",
    "year": "number (optional)",
    "medium": "string (optional)",
    "price": "number (optional)",
    "description": "string (optional)",
    "category": "string (painting|sculpture|photography|digital|mixed-media|other)",
    "dimensions": "string (optional)",
    "isAvailable": "boolean (default: true)",
    "createdAt": "string (ISO timestamp)",
    "updatedAt": "string (ISO timestamp)"
}
```

## API Response Format

### Success Response
```json
{
    "success": true,
    "data": { /* result data */ },
    "message": "Optional success message"
}
```

### List Response
```json
{
    "success": true,
    "count": 10,
    "data": [ /* array of results */ ]
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error type",
    "message": "Error description",
    "messages": ["Validation error 1", "Validation error 2"]
}
```

## AWS EC2 Deployment

### Prerequisites
- AWS EC2 instance with Node.js installed
- Security group allowing HTTP traffic on your chosen port

### Deployment Steps

1. **Connect to your EC2 instance:**
```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

2. **Install Node.js and npm:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

3. **Clone and setup the application:**
```bash
git clone <your-repository-url>
cd artmart-api
npm install --production
```

4. **Set environment variables:**
```bash
export PORT=3000
export NODE_ENV=production
```

5. **Start the application with PM2 (recommended):**
```bash
sudo npm install -g pm2
pm2 start server.js --name "artmart-api"
pm2 startup
pm2 save
```

6. **Configure your security group:**
   - Allow inbound traffic on port 3000 (or your chosen port)
   - Source: 0.0.0.0/0 for public access

### Production Considerations

- Use a proper database (MongoDB, PostgreSQL, etc.) instead of in-memory storage
- Implement authentication and authorization
- Add rate limiting
- Use HTTPS with SSL certificates
- Implement proper logging and monitoring
- Add input sanitization
- Consider using a reverse proxy (nginx) for better performance

## Example Usage

```bash
# Get all arts
curl http://localhost:3000/api/arts

# Get art by ID
curl http://localhost:3000/api/arts/1

# Create new art
curl -X POST http://localhost:3000/api/arts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Landscape",
    "artist": "John Doe",
    "year": 2023,
    "medium": "Acrylic on canvas",
    "price": 2500,
    "description": "A serene mountain landscape",
    "category": "painting"
  }'

# Update art
curl -X PUT http://localhost:3000/api/arts/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 3000}'

# Delete art
curl -X DELETE http://localhost:3000/api/arts/1
```

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please create an issue in the repository.