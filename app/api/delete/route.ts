import getCurrentUser from "@/actions/getCurrentuser";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
// import { getUserInfo } from "@/lib/get-user-info";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const user = await getCurrentUser();
    if (!user) {
      redirect("/");
    }
    if (user.id !== data.file.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await db.file.delete({
      where: {
        id: data.file.id,
      },
    });
    return new NextResponse("Successfully Deleted", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
