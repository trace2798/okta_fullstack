import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import getCurrentUser from "@/actions/getCurrentuser";


export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    console.log(body);
    if (!user) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const {
      name,
      domain,
      issuer,
      authorization_endpoint,
      token_endpoint,
      userinfo_endpoint,
      client_id,
      client_secret,
      apikey,
    } = body;


    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!domain) {
      return new NextResponse("Domain is required", { status: 400 });
    }
    const hashedApiKey = await bcrypt.hash(apikey, 12);

    const org = await db.org.create({
      data: {
        name,
        domain,
        issuer,
        authorization_endpoint,
        token_endpoint,
        userinfo_endpoint,
        client_id,
        client_secret,
        apikey: hashedApiKey,
      },
    });
    console.log(org, "ORG");
    return NextResponse.json("OK");
  } catch (error) {
    // console.log("[STORES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
