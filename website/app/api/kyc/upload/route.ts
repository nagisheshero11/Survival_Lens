import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { authenticateUser } from "@/middleware/auth";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

function getExtension(fileName: string, mimeType: string): string {
  const extFromName = path.extname(fileName).replace(".", "").toLowerCase();
  if (extFromName) return extFromName;

  const extFromMime = mimeType.split("/")[1]?.toLowerCase();
  return extFromMime || "jpg";
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { message: authResult.error || "Unauthorized" },
        { status: authResult.status || 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const field = String(formData.get("field") || "dashboardScreenshot");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    if (field !== "dashboardScreenshot") {
      return NextResponse.json(
        { message: "Only dashboardScreenshot uploads are supported on this endpoint" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Unsupported file type. Use JPG, PNG, or WEBP." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { message: "Invalid file size. Max size is 5MB." },
        { status: 400 }
      );
    }

    const userId = String(authResult.user._id);
    const ext = getExtension(file.name, file.type);
    const uniqueName = `${field}_${Date.now()}_${randomUUID().slice(0, 8)}.${ext}`;

    const relativeDir = path.join("uploads", "kyc", userId);
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);
    await fs.mkdir(absoluteDir, { recursive: true });

    const absolutePath = path.join(absoluteDir, uniqueName);
    const bytes = await file.arrayBuffer();
    await fs.writeFile(absolutePath, Buffer.from(bytes));

    const url = `/${path.join(relativeDir, uniqueName).replace(/\\/g, "/")}`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
