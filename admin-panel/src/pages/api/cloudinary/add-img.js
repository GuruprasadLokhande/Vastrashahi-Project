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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Received image upload request');
    
    // Parse the incoming form data using the latest formidable syntax
    const options = {
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    };
    
    const form = formidable(options);
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get the file from the parsed form data - formidable v4 returns an array
    const fileArr = files.image;
    if (!fileArr || fileArr.length === 0) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    
    const file = Array.isArray(fileArr) ? fileArr[0] : fileArr;
    
    console.log('Parsed file:', file.originalFilename);
    console.log('File path:', file.filepath);
    
    if (!file.filepath || !fs.existsSync(file.filepath)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file path', 
        error: `File path '${file.filepath}' is not valid or doesn't exist`
      });
    }
    
    // Use the correct Cloudinary credentials from env variables
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'profile';
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'Vastrashahi';
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    console.log('Using Cloudinary config:', { cloudName, uploadPreset });

    // Read the file as buffer
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Convert to base64 for easier handling in the request
    const base64Data = fileBuffer.toString('base64');
    const fileExt = path.extname(file.originalFilename || 'unknown.jpg').substring(1);
    const dataURI = `data:image/${fileExt};base64,${base64Data}`;
    
    // First try unsigned upload (requires preset to be set to "unsigned")
    try {
      console.log('Attempting unsigned upload with preset...');
      
      // Upload to Cloudinary using the unsigned upload endpoint
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      const cloudinaryResponse = await axios.post(cloudinaryUrl, {
        file: dataURI,
        upload_preset: uploadPreset
      });
      
      console.log('Unsigned upload successful');
      
      // Return success response with the image URL
      return res.status(200).json({
        success: true,
        data: {
          url: cloudinaryResponse.data.secure_url,
          public_id: cloudinaryResponse.data.public_id
        }
      });
    } catch (unsignedError) {
      console.log('Unsigned upload failed, trying signed upload:', unsignedError.message);
      
      // If unsigned upload fails, try signed upload
      if (apiKey && apiSecret) {
        console.log('Attempting signed upload with API key and secret...');
        
        try {
          const timestamp = Math.floor(Date.now() / 1000);
          
          // Prepare parameters for signing
          const paramsToSign = {
            timestamp: timestamp.toString(),
            public_id: `vastrashahi_${Date.now()}`,
          };
          
          // Create the signature
          const signature = generateSignature(paramsToSign, apiSecret);
          
          // Upload with signed parameters
          const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
          
          const signedParams = {
            file: dataURI,
            api_key: apiKey,
            timestamp: timestamp,
            signature: signature,
            ...paramsToSign
          };
          
          const signedResponse = await axios.post(cloudinaryUrl, signedParams);
          
          console.log('Signed upload successful');
          
          return res.status(200).json({
            success: true,
            data: {
              url: signedResponse.data.secure_url,
              public_id: signedResponse.data.public_id
            }
          });
        } catch (signedError) {
          console.error('Signed upload failed:', signedError.message);
          throw signedError;
        }
      } else {
        throw unsignedError;
      }
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error.message);
    console.error('Full error:', error);
    if (error.response) {
      console.error('Cloudinary error response:', JSON.stringify(error.response.data));
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Error uploading image to Cloudinary', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
} 