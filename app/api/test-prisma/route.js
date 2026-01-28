import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.User.findMany({ take: 1 });
    await prisma.user.create({
      data: {
        name: "test1",
        email: "abc@gmail.com",
        image: "cloudinary_url",
        provider: "manual"
        // password is not needed now because we made it optional (?)
      }
    });
    return new Response(JSON.stringify({ success: true, sampleUser: users[0] || null }), { status: 200 });
  }  catch (err) {
  console.error("FULL DB ERROR:", err); // Check your VS Code terminal for this!
  return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });

  }
}
