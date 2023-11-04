import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    const domain = body.email.split("@")[1];
    const verifyDomain = await db.org.findFirst({
      where: {
        domain: domain,
      },
    });
    if (!verifyDomain) {
      return new Response(
        "Organization with that domain does not exist exists",
        { status: 409 }
      );
    }
    const checkUser = await db.user.findFirst({
      where: {
        email: body.email,
        orgId: verifyDomain.id,
      },
    });
    if (!checkUser) {
      return new Response(
        "User with that email dne in that org",
        { status: 408 }
      );
    }
    return new NextResponse("Ok", { status: 200 });
  } catch (error) {
    return new NextResponse("error");
  }
}
