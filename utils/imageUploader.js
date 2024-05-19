const cloudinary = require('cloudinary').v2


exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        if (!file || !file.tempFilePath) {
            throw new Error("File or tempFilePath is undefined");
        }

        const options = { folder };
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }
        options.resource_type = "auto";

        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error; // Re-throw the error to propagate it to the caller
    }
};
