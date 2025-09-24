#!/bin/bash

# ArtMart API Test Script
# This script tests all the CRUD endpoints of the ArtMart API

BASE_URL="http://localhost:3000"
echo "Testing ArtMart API at $BASE_URL"
echo "======================================"

# Test 1: Health check
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/health" | jq .
echo -e "\n"

# Test 2: Get all arts (should return sample data)
echo "2. Getting all arts..."
curl -s "$BASE_URL/api/arts" | jq .
echo -e "\n"

# Test 3: Create a new art
echo "3. Creating a new art..."
NEW_ART_RESPONSE=$(curl -s -X POST "$BASE_URL/api/arts" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Art",
    "artist": "Test Artist",
    "year": 2024,
    "medium": "Digital",
    "price": 1500,
    "description": "A test art piece",
    "category": "digital"
  }')

echo $NEW_ART_RESPONSE | jq .

# Extract the ID of the created art
ART_ID=$(echo $NEW_ART_RESPONSE | jq -r '.data.id')
echo "Created art with ID: $ART_ID"
echo -e "\n"

# Test 4: Get the specific art by ID
echo "4. Getting art by ID ($ART_ID)..."
curl -s "$BASE_URL/api/arts/$ART_ID" | jq .
echo -e "\n"

# Test 5: Update the art
echo "5. Updating the art..."
curl -s -X PUT "$BASE_URL/api/arts/$ART_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 2000,
    "description": "Updated test art piece"
  }' | jq .
echo -e "\n"

# Test 6: Filter arts by category
echo "6. Filtering arts by category (digital)..."
curl -s "$BASE_URL/api/arts?category=digital" | jq .
echo -e "\n"

# Test 7: Delete the art
echo "7. Deleting the art..."
curl -s -X DELETE "$BASE_URL/api/arts/$ART_ID" | jq .
echo -e "\n"

# Test 8: Verify deletion
echo "8. Verifying deletion (should return 404)..."
curl -s "$BASE_URL/api/arts/$ART_ID" | jq .
echo -e "\n"

# Test 9: Test validation errors
echo "9. Testing validation errors..."
curl -s -X POST "$BASE_URL/api/arts" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "artist": "",
    "year": 2030,
    "price": -100
  }' | jq .
echo -e "\n"

echo "API testing completed!"