const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage for arts (in production, use a database)
let arts = [
    {
        id: '1',
        title: 'Starry Night',
        artist: 'Vincent van Gogh',
        year: 1889,
        medium: 'Oil on canvas',
        price: 100000000,
        description: 'A masterpiece depicting a swirling night sky over a village',
        category: 'painting',
        dimensions: '73.7 cm × 92.1 cm',
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'The Thinker',
        artist: 'Auguste Rodin',
        year: 1904,
        medium: 'Bronze',
        price: 15000000,
        description: 'A bronze sculpture depicting a man in sober meditation',
        category: 'sculpture',
        dimensions: '186 cm height',
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Validation helper
const validateArt = (art, isUpdate = false) => {
    const errors = [];
    
    if (!isUpdate || art.title !== undefined) {
        if (!art.title || typeof art.title !== 'string' || art.title.trim().length === 0) {
            errors.push('Title is required and must be a non-empty string');
        }
    }
    
    if (!isUpdate || art.artist !== undefined) {
        if (!art.artist || typeof art.artist !== 'string' || art.artist.trim().length === 0) {
            errors.push('Artist is required and must be a non-empty string');
        }
    }
    
    if (art.year && (!Number.isInteger(art.year) || art.year < 0 || art.year > new Date().getFullYear())) {
        errors.push('Year must be a valid integer between 0 and current year');
    }
    
    if (art.price && (!Number.isFinite(art.price) || art.price < 0)) {
        errors.push('Price must be a non-negative number');
    }
    
    if (art.category && !['painting', 'sculpture', 'photography', 'digital', 'mixed-media', 'other'].includes(art.category)) {
        errors.push('Category must be one of: painting, sculpture, photography, digital, mixed-media, other');
    }
    
    return errors;
};

// GET /api/arts - Get all arts
router.get('/', (req, res) => {
    try {
        const { category, artist, available, sortBy = 'createdAt', order = 'desc' } = req.query;
        let filteredArts = [...arts];
        
        // Apply filters
        if (category) {
            filteredArts = filteredArts.filter(art => art.category === category);
        }
        
        if (artist) {
            filteredArts = filteredArts.filter(art => 
                art.artist.toLowerCase().includes(artist.toLowerCase())
            );
        }
        
        if (available !== undefined) {
            const isAvailable = available === 'true';
            filteredArts = filteredArts.filter(art => art.isAvailable === isAvailable);
        }
        
        // Apply sorting
        filteredArts.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (order === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        res.json({
            success: true,
            count: filteredArts.length,
            data: filteredArts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch arts',
            message: error.message
        });
    }
});

// GET /api/arts/:id - Get single art by ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const art = arts.find(a => a.id === id);
        
        if (!art) {
            return res.status(404).json({
                success: false,
                error: 'Art not found',
                message: `No art found with ID: ${id}`
            });
        }
        
        res.json({
            success: true,
            data: art
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch art',
            message: error.message
        });
    }
});

// POST /api/arts - Create new art
router.post('/', (req, res) => {
    try {
        const artData = req.body;
        
        // Validate input
        const validationErrors = validateArt(artData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                messages: validationErrors
            });
        }
        
        // Create new art object
        const newArt = {
            id: uuidv4(),
            title: artData.title.trim(),
            artist: artData.artist.trim(),
            year: artData.year || null,
            medium: artData.medium || '',
            price: artData.price || 0,
            description: artData.description || '',
            category: artData.category || 'other',
            dimensions: artData.dimensions || '',
            isAvailable: artData.isAvailable !== undefined ? artData.isAvailable : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        arts.push(newArt);
        
        res.status(201).json({
            success: true,
            message: 'Art created successfully',
            data: newArt
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create art',
            message: error.message
        });
    }
});

// PUT /api/arts/:id - Update existing art
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const artData = req.body;
        
        const artIndex = arts.findIndex(a => a.id === id);
        if (artIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Art not found',
                message: `No art found with ID: ${id}`
            });
        }
        
        // Validate input for updates
        const validationErrors = validateArt(artData, true);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                messages: validationErrors
            });
        }
        
        // Update art object
        const existingArt = arts[artIndex];
        const updatedArt = {
            ...existingArt,
            title: artData.title ? artData.title.trim() : existingArt.title,
            artist: artData.artist ? artData.artist.trim() : existingArt.artist,
            year: artData.year !== undefined ? artData.year : existingArt.year,
            medium: artData.medium !== undefined ? artData.medium : existingArt.medium,
            price: artData.price !== undefined ? artData.price : existingArt.price,
            description: artData.description !== undefined ? artData.description : existingArt.description,
            category: artData.category !== undefined ? artData.category : existingArt.category,
            dimensions: artData.dimensions !== undefined ? artData.dimensions : existingArt.dimensions,
            isAvailable: artData.isAvailable !== undefined ? artData.isAvailable : existingArt.isAvailable,
            updatedAt: new Date().toISOString()
        };
        
        arts[artIndex] = updatedArt;
        
        res.json({
            success: true,
            message: 'Art updated successfully',
            data: updatedArt
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update art',
            message: error.message
        });
    }
});

// DELETE /api/arts/:id - Delete art
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const artIndex = arts.findIndex(a => a.id === id);
        
        if (artIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Art not found',
                message: `No art found with ID: ${id}`
            });
        }
        
        const deletedArt = arts.splice(artIndex, 1)[0];
        
        res.json({
            success: true,
            message: 'Art deleted successfully',
            data: deletedArt
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete art',
            message: error.message
        });
    }
});

module.exports = router;