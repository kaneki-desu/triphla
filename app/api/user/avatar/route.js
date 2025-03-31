import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import fs from 'fs/promises';
import path from 'path';

// Ensure the avatars directory exists
const avatarsDir = path.resolve(process.cwd(), 'public/avatars');
fs.mkdir(avatarsDir, { recursive: true }); // Creates the directory if it doesn't exist

export async function POST(request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('avatar');

    if (!file || typeof file === 'string') {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // Basic validation (optional: add more checks like file size, type)
    if (!file.type.startsWith('image/')) {
        return new NextResponse("Invalid file type, please upload an image.", { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);
    // Use userId to ensure unique filenames and prevent overwrites
    const filename = `${userId}${fileExtension}`;
    const filepath = path.join(avatarsDir, filename);

    // Save the file
    await fs.writeFile(filepath, fileBuffer);

    const avatarUrl = `/avatars/${filename}`; // URL path relative to public folder

    // --- Database Step (Placeholder) ---
    // In a real implementation, you would save `avatarUrl` to your user profile
    // database record associated with `userId` here.
    // Example: await updateUserAvatar(userId, avatarUrl);
    // --- End Database Step ---

    return NextResponse.json({ success: true, avatarUrl });

  } catch (error) {
    console.error("Avatar upload error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
