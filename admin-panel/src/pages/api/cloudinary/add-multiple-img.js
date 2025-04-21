import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Generate signature for signed uploads
const generateSignature = (paramsToSign, apiSecret) => {
  const params = new URLSearchParams(paramsToSign);
  params.sort();
  
  return crypto
    .createHash('sha1')
    .update(params.toString() + apiSecret)
    .digest('hex');
};

// Function to upload a single image to Cloudinary
const uploadToCloudinary = async (file, cloudName, uploadPreset, apiKey, apiSecret) => {
  // Read the file as buffer
  const fileBuffer = fs.readFileSync(file.filepath);
  
  // Convert to base64 for easier handling in the request
  const base64Data = fileBuffer.toString('base64');
  const fileExt = path.extname(file.originalFilename || 'unknown.jpg').substring(1);
  const dataURI = `data:image/${fileExt};base64,${base64Data}`;
  
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  // First try unsigned upload
  try {
    const response = await axios.post(cloudinaryUrl, {
      file: dataURI,
      upload_preset: uploadPreset
    });
    
    return {
      url: response.data.secure_url,
      public_id: response.data.public_id
    };
  } catch (unsignedError) {
    // If unsigned fails and we have API credentials, try signed upload
    if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      
      // Prepare parameters for signing
      const paramsToSign = {
        timestamp: timestamp.toString(),
        public_id: `vastrashahi_${Date.now()}_${file.originalFilename}`,
      };
      
      // Create the signature
      const signature = generateSignature(paramsToSign, apiSecret);
      
      // Upload with signed parameters
      const signedParams = {
        file: dataURI,
        api_key: apiKey,
        timestamp: timestamp,
        signature: signature,
        ...paramsToSign
      };
      
      const signedResponse = await axios.post(cloudinaryUrl, signedParams);
      
      return {
        url: signedResponse.data.secure_url,
        public_id: signedResponse.data.public_id
      };
    } else {
      throw unsignedError;
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Received multiple image upload request');
    
    // Parse the incoming form data using the latest formidable syntax
    const options = {
      keepExtensions: true,
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    };
    
    const form = formidable(options);
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get the files from the parsed form data
    const imageFiles = files.images;
    
    if (!imageFiles || (Array.isArray(imageFiles) && imageFiles.length === 0)) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    console.log('Parsed files count:', Array.isArray(imageFiles) ? imageFiles.length : 1);
    
    // Use the correct Cloudinary credentials from env variables
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'profile';
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'Vastrashahi';
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    console.log('Using Cloudinary config:', { cloudName, uploadPreset });
    
    // Convert to array if single file
    const imagesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
    
    // Upload each image to Cloudinary
    const uploadPromises = imagesArray.map(async (file, index) => {
      console.log(`Processing file ${index + 1}:`, file.originalFilename);
      console.log(`File path:`, file.filepath);
      
      if (!file.filepath || !fs.existsSync(file.filepath)) {
        throw new Error(`Invalid file path for image ${index + 1}: '${file.filepath}'`);
      }
      
      try {
        console.log(`Uploading file ${index + 1} to Cloudinary...`);
        const result = await uploadToCloudinary(file, cloudName, uploadPreset, apiKey, apiSecret);
        console.log(`File ${index + 1} uploaded successfully`);
        return result;
      } catch (uploadError) {
        console.error(`Error uploading file ${index + 1}:`, uploadError.message);
        if (uploadError.response) {
          console.error(`Cloudinary error for file ${index + 1}:`, JSON.stringify(uploadError.response.data));
        }
        throw uploadError;
      }
    });

    // Wait for all uploads to complete
    const uploadedImages = await Promise.all(uploadPromises);
    
    console.log('All images uploaded successfully');

    // Return success response with all image URLs
    return res.status(200).json({
      success: true,
      data: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error.message);
    console.error('Full error:', error);
    if (error.response) {
      console.error('Cloudinary error response:', JSON.stringify(error.response.data));
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Error uploading images to Cloudinary', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
} 