import { db } from "@/lib/db";
import { getPineconeClient } from "@/lib/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // console.log(data, "DATA");
    const response = await fetch(`${data.file.url}`);
    // console.log(response);
    const blob = await response.blob();
    // console.log(blob, "BLOG");
    const loader = new PDFLoader(blob);
    // console.log(loader, "LOADER");
    const pageLevelDocs = await loader.load();
    // console.log(pageLevelDocs);
    const pagesAmt = pageLevelDocs.length;
    // console.log(pagesAmt);
    const pinecone = await getPineconeClient();
    // console.log(pinecone, "PINECONE");
    const pineconeIndex = pinecone.Index("converseaiokta");
    try {
      for (const doc of pageLevelDocs) {
        // console.log(doc);
        const txtPath = doc.metadata.loc.pageNumber;
        const text = doc.pageContent;

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
        });
        //Split text into chunks (documents)
        const chunks = await textSplitter.createDocuments([text]);
        // console.log(`Total chunks: ${chunks.length}`);
        const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
          chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
        );
        const batchSize = 100;
        let batch: any = [];
        for (let idx = 0; idx < chunks.length; idx++) {
          const chunk = chunks[idx];
          const vector = {
            id: `${data.file.id}_${idx}`,
            values: embeddingsArrays[idx],
            metadata: {
              ...chunk.metadata,
              loc: JSON.stringify(chunk.metadata.loc),
              pageContent: chunk.pageContent,
              txtPath: txtPath,
              filter: `${data.file.id}`,
            },
          };
          const existingRecord = await db.index.findFirst({
            where: {
              name: vector.id,
            },
          });

          // If it doesn't exist, create a new record
          if (!existingRecord) {
            await db.index.create({
              data: {
                name: vector.id,
                indexStatus: "SUCCESS",
                fileId: data.file.id,
              },
            });
          }
          batch = [...batch, vector];
          if (batch.length === batchSize || idx === chunks.length - 1) {
            //change this to your COMMAND_TO_UPSERT_TO_PINECONE
            await pineconeIndex.upsert(batch);
            // console.log("Upserting Vector");
            // Empty the batch
            batch = [];
          }
        }
        // Log the number of vectors updated just for verification purpose
        // console.log(`Pinecone index updated with ${chunks.length} vectors`);
        await db.file.update({
          data: {
            indexStatus: true,
            totalChunks: chunks.length,
          },
          where: {
            id: data.file.id,
          },
        });
      }
    } catch (err) {
      // console.log("error: Error in upserting in pinecone ", err);
      return new NextResponse("Error in upserting in pinecone", {
        status: 400,
      });
    }
    return new NextResponse("FROM INDEX API", { status: 200 });
  } catch (error) {
    return new NextResponse("No Matches", { status: 400 });
  }
}
