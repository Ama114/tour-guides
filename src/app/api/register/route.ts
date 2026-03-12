import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    await connectToDatabase();

    // ඊමේල් එක දැනටමත් තියෙනවද කියලා බලනවා
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists." }, { status: 400 });
    }

    // පාස්වර්ඩ් එක hash කරනවා (සෙකියුරිටි එකට)
    const hashedPassword = await bcrypt.hash(password, 10);

    // අලුත් User ව ඩේටාබේස් එකේ සේව් කරනවා
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    console.log("Error during registration: ", error);
    return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
  }
}