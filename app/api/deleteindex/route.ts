import { db } from "@/lib/db";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // console.log(body);
    // console.log("INDEX IDS NOW");
    const indexId = await db.index.findMany({
      where: {
        fileId: body.data.file.id,
      },
      select: {
        name: true,
      },
    });
    // console.log(indexId, "INDEX ID");
    const indexNames = indexId.map((record) => record.name);
    // console.log(indexNames, "INDEX ID");
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    });
    // console.log(pinecone);
    const index = pinecone.index("converseaiokta");
    // await index.deleteMany(indexNames);
    if (indexNames.length === 0) {
      return new NextResponse("Nothing to Delete", { status: 200 });
    } else if (indexNames.length === 1) {
      await index.deleteOne(indexNames[0]);
    } else {
      await index.deleteMany(indexNames);
    }
    return new NextResponse("Successfully Deleted", { status: 200 });
  } catch (error) {
    // console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
