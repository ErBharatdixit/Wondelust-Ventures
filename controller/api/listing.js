const Listing = require("../../models/listing");

module.exports.index = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, country, minRating, sort, category, page = 1, limit = 12 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build query object
        let query = {};

        // Search by title, location, or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by country
        if (country) {
            query.country = { $regex: country, $options: 'i' };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        let listings;
        let totalListings = 0;

        if (minRating || sort === 'rating') {
            // Use aggregation for rating-based queries
            const pipeline = [
                { $match: query },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "reviews",
                        foreignField: "_id",
                        as: "reviewsData"
                    }
                },
                {
                    $addFields: {
                        averageRating: { $avg: "$reviewsData.rating" },
                        reviewCount: { $size: "$reviewsData" }
                    }
                }
            ];

            // Filter by minimum rating
            if (minRating) {
                pipeline.push({
                    $match: { averageRating: { $gte: Number(minRating) } }
                });
            }

            // Sorting
            let sortObj = {};
            switch (sort) {
                case 'price-asc':
                    sortObj = { price: 1 };
                    break;
                case 'price-desc':
                    sortObj = { price: -1 };
                    break;
                case 'rating':
                    sortObj = { averageRating: -1, reviewCount: -1 };
                    break;
                case 'popularity':
                    sortObj = { popularity: -1 };
                    break;
                case 'newest':
                    sortObj = { createdAt: -1 };
                    break;
                default:
                    sortObj = { createdAt: -1 };
            }
            pipeline.push({ $sort: sortObj });

            // Count total before pagination
            // Note: This might be expensive for large datasets, but necessary for aggregation
            const countPipeline = [...pipeline, { $count: "total" }];
            const countResult = await Listing.aggregate(countPipeline);
            totalListings = countResult.length > 0 ? countResult[0].total : 0;

            // Apply pagination
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limitNum });

            listings = await Listing.aggregate(pipeline);
        } else {
            // Simple query without rating
            let sortObj = {};
            switch (sort) {
                case 'price-asc':
                    sortObj = { price: 1 };
                    break;
                case 'price-desc':
                    sortObj = { price: -1 };
                    break;
                case 'popularity':
                    sortObj = { popularity: -1 };
                    break;
                case 'newest':
                    sortObj = { createdAt: -1 };
                    break;
                default:
                    sortObj = { createdAt: -1 };
            }

            totalListings = await Listing.countDocuments(query);
            listings = await Listing.find(query)
                .sort(sortObj)
                .skip(skip)
                .limit(limitNum);
        }

        res.status(200).json({
            listings,
            currentPage: pageNum,
            totalPages: Math.ceil(totalListings / limitNum),
            totalListings
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.showDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(
            id,
            { $inc: { popularity: 1 } },
            { new: true }
        )
            .populate({
                path: 'reviews',
                populate: { path: 'author' }
            })
            .populate('owner');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.createNewListing = async (req, res) => {
    try {
        // Reconstruct listing object if it's sent as flat keys (listing[title], etc)
        if (!req.body.listing && Object.keys(req.body).some(key => key.startsWith('listing['))) {
            req.body.listing = {};
            for (let key in req.body) {
                if (key.startsWith('listing[')) {
                    const nestedKey = key.match(/listing\[(.*?)\]/)[1];
                    req.body.listing[nestedKey] = req.body[key];
                }
            }
        }

        const newListing = new Listing(req.body.listing);
        if (req.user) {
            newListing.owner = req.user._id;
        }

        // Handle multiple images
        if (req.files && req.files.length > 0) {
            newListing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
            // Set the first image as the main image for backward compatibility
            newListing.image = newListing.images[0];
        } else if (req.body.listing.imageUrl) {
            // Handle URL input
            const imageObj = { url: req.body.listing.imageUrl, filename: 'link' };
            newListing.image = imageObj;
            newListing.images = [imageObj];
        }

        // Set default geometry if not provided
        if (!newListing.geometry || !newListing.geometry.coordinates) {
            newListing.geometry = {
                type: 'Point',
                coordinates: [78.9629, 20.5937] // Default to India center
            };
        }

        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Reconstruct listing object if it's sent as flat keys (listing[title], etc)
        if (!req.body.listing && Object.keys(req.body).some(key => key.startsWith('listing['))) {
            req.body.listing = {};
            for (let key in req.body) {
                if (key.startsWith('listing[')) {
                    const nestedKey = key.match(/listing\[(.*?)\]/)[1];
                    req.body.listing[nestedKey] = req.body[key];
                }
            }
        }

        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Handle multiple images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
            // Append new images to existing ones (or replace? Let's append for now)
            // Actually, for simplicity in this phase, let's just add them.
            // But we need to make sure we don't lose existing ones unless intended.
            // The user might want to delete specific images, but that requires a separate UI.
            // For now, let's just push them.
            listing.images.push(...newImages);

            // Update main image if it was empty or just to refresh it
            if (!listing.image || !listing.image.url) {
                listing.image = newImages[0];
            }
            await listing.save();
        } else if (req.body.listing.imageUrl) {
            // If URL is provided, maybe add it? Or replace main image?
            // Let's assume URL input is for main image or adding one.
            const imageObj = { url: req.body.listing.imageUrl, filename: 'link' };
            listing.images.push(imageObj);
            listing.image = imageObj;
            await listing.save();
        }

        // Fetch updated listing to return
        const updatedListing = await Listing.findById(id);
        res.status(200).json(updatedListing);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.trending = async (req, res) => {
    try {
        const trendingListings = await Listing.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "reviews",
                    foreignField: "_id",
                    as: "reviewsData"
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: "$reviewsData.rating" },
                    reviewCount: { $size: "$reviewsData" }
                }
            },
            {
                $sort: { averageRating: -1, reviewCount: -1, popularity: -1 }
            },
            { $limit: 3 }
        ]);

        res.status(200).json(trendingListings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const userId = req.user._id;

        // Check if user already liked using equals for ObjectId comparison
        const isLiked = listing.likes.some(likeId => likeId.equals(userId));

        if (isLiked) {
            listing.likes.pull(userId);
        } else {
            listing.likes.push(userId);
        }
        await listing.save();
        res.status(200).json({ likes: listing.likes });
    } catch (err) {
        console.error("Error toggling like:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json({ message: 'Listing deleted', deletedListing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
