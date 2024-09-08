// controllers/urlController.js
import Url from '../Models/Url.js';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const shortenUrl = async (req, res) => {
    console.log("first", req.body)
    const { originalUrl } = req.body;
    console.log("first", originalUrl)
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000'; // Define your base URL here

    try {
        // Check if the original URL already exists
        let url = await Url.findOne({ originalUrl });

        if (url) {
            // Return the existing shortened URL
            return res.status(200).json({
                originalUrl: url.originalUrl,
                shortUrl: `${baseUrl}/${url.shortUrl}`
            });
        }

        // If it doesn't exist, create a new short URL
        url = new Url({ originalUrl });
        await url.save();

        // Return the new shortened URL
        res.status(201).json({
            originalUrl: url.originalUrl,
            shortUrl: `${baseUrl}/${url.shortUrl}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// export const redirectUrl = async (req, res) => {
//     console.log("Received request for shortUrl:", req.params.shortUrl);
//     try {
//         const url = await Url.findOne({ shortUrl: req.params.shortUrl });

//         if (url) {
//             url.clicks++;
//             await url.save();
//             return res.redirect(url.originalUrl);
//         }

//         res.status(404).json({ error: 'URL not found' });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };


// // Redirect to an intermediate page before redirecting to the original URL
// export const redirectUrl = async (req, res) => {
//     console.log("Received request for shortUrl:", req.params.shortUrl);
//     try {
//         // Find the URL document by its short URL path
//         const url = await Url.findOne({ shortUrl: req.params.shortUrl });
//         console.log("first", url)

//         if (url) {
//             // Increment the click count and save the updated document
//             url.clicks++;
//             await url.save();

//             // Serve the HTML file and inject the original URL into it
//             res.sendFile(path.join(__dirname, 'public', 'redirect.html'), (err) => {
//                 if (!err) {
//                     res.write(`
//                         <script>
//                             setTimeout(function() {
//                                 window.location.href = "${url.originalUrl}";
//                             }, 3000);
//                         </script>
//                     `);
//                     res.end();
//                 } else {
//                     res.status(500).json({ error: 'Error loading redirect page' });
//                 }
//             });
//         } else {
//             // Return a 404 status if the URL is not found
//             res.status(404).json({ error: 'URL not found' });
//         }
//     } catch (error) {
//         // Return a 500 status if there is a server error
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// export const redirectUrl = async (req, res) => {
//     try {
//         console.log("Received request for shortUrl:", req.params.shortUrl);

//         const url = await Url.findOne({ shortUrl: req.params.shortUrl });

//         if (url) {
//             console.log("Found original URL:", url.originalUrl);
//             url.clicks++;
//             await url.save();

//             res.sendFile(path.join(__dirname, '..', 'public', 'redirect.html'), (err) => {
//                 if (err) {
//                     console.error("Error serving redirect.html:", err);
//                     res.status(500).json({ error: 'Error loading redirect page' });
//                 } else {
//                     res.write(`
//                         <script>
//                             setTimeout(function() {
//                                 window.location.href = "${url.originalUrl}";
//                             }, 3000);
//                         </script>
//                     `);
//                     res.end();
//                 }
//             });
//         } else {
//             console.log("Short URL not found:", req.params.shortUrl);
//             res.status(404).json({ error: 'URL not found' });
//         }
//     } catch (error) {
//         console.error("Server error:", error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };
export const redirectUrl = async (req, res) => {
    try {
        // Find the URL document by its short URL path
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });

        if (url) {
            // Increment the click count and save the updated document
            url.clicks++;
            await url.save();

            // Send the HTML with the injected URL
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Redirecting...</title>
                </head>
                <body>
                    <h1>Redirecting...</h1>
                    <p>You will be redirected to the original URL in a few seconds.</p>
                    <script>
                        setTimeout(function() {
                            window.location.href = "${url.originalUrl}";
                        }, 500);
                    </script>
                </body>
                </html>
            `);
        } else {
            // Return a 404 status if the URL is not found
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        // Return a 500 status if there is a server error
        res.status(500).json({ error: 'Server error' });
    }
};


// Function to get all URLs with pagination
export const getAllUrls = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

    try {
        // Retrieve the URLs with pagination
        const urls = await Url.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .exec();

        // Get the total count of URLs
        const count = await Url.countDocuments();

        res.status(200).json({
            urls,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalUrls: count,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Function to delete a URL by its ID
export const deleteUrl = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the URL document by its ID and delete it
        const url = await Url.findByIdAndDelete(id);

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
