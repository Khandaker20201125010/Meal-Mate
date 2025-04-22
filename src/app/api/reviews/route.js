import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';

import path from 'path';

import connectDB from '../../lib/connectDB';
import Review from '@/src/models/Review';

export async function GET() {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 });
    return NextResponse.json(reviews);
}

// In your API route
export async function POST(req) {
    try {
        await connectDB();
        const formData = await req.formData();

        // Validate required fields
        const requiredFields = ['userEmail', 'userName', 'rating', 'comment'];
        const missingFields = requiredFields.filter(field => !formData.get(field));

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Process data
        const newReview = await Review.create({
            userEmail: formData.get('userEmail'),
            userName: formData.get('userName'),
            rating: Number(formData.get('rating')),
            comment: formData.get('comment'),
            image: await processImageUpload(formData.get('image')),
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

async function processImageUpload(imageFile) {
    // In your API route (app/api/reviews/route.js)
    if (imageFile && imageFile !== 'undefined' && imageFile !== 'null') {
        try {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${randomUUID()}-${imageFile.name}`;
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

            // Ensure uploads directory exists
            await fs.promises.mkdir(uploadsDir, { recursive: true });

            const filepath = path.join(uploadsDir, filename);
            await writeFile(filepath, buffer);
            imageUrl = `/uploads/${filename}`;
        } catch (fileError) {
            console.error('File upload error:', fileError);
            // Continue without image if upload fails
        }
    }
}