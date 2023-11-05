import { db } from "@/lib/db";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { OpenAI } from "langchain/llms/openai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // console.log(body, "BODY");
    await db.message.create({
      data: {
        text: body.messages[body.messages.length - 1].content,
        fileId: body.fileId,
        userId: body.userId,
        isUserMessage: true,
      },
    });
    const question = body.messages[body.messages.length - 1].content;
    // console.log(question);
    const vectorIDS = await db.index.findMany({
      where: {
        fileId: body.fileId,
      },
    });
    // console.log(vectorIDS, vectorIDS);
    //Change this to your embed and query command link
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    });
    const index = pinecone.index("converseaiokta");
    const anyscale = new OpenAI({
      apiKey: process.env.ANYSCALE_API_KEY!,
      baseURL: process.env.ANYSCALE_API_BASE!,
    });
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
    // 4. Query Pinecone index and return top 10 matches
    const queryResponse = await index.query({
      topK: 5,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    });
    // console.log(queryResponse);

    // console.log(`Asking question: ${question}...`);
    if (
      queryResponse &&
      queryResponse.matches &&
      queryResponse.matches.length
    ) {
      const concatenatedPageContent = queryResponse.matches
        .map((match: any) => match.metadata.pageContent)
        .join(" ");
      // console.log(concatenatedPageContent, "concatenatedPageContent");

      const prevMessages = await db.message.findMany({
        where: {
          fileId: body.fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
      });

      const formattedPrevMessages = prevMessages.map((msg) => ({
        role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));
      // console.log(formattedPrevMessages);
      let result;
      if (prevMessages.length < 6) {
        result = await anyscale.chat.completions.create({
          model: "meta-llama/Llama-2-70b-chat-hf",
          temperature: 0.5,
          stream: true,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant who uses the following pieces of context to answer the users question.",
            },
            {
              role: "user",
              content: `Use the following pieces of context: ${concatenatedPageContent} to answer the users question: ${question}. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
      Helpful Answer:`,
            },
          ],
        });
      } else {
        result = await anyscale.chat.completions.create({
          model: "meta-llama/Llama-2-70b-chat-hf",
          temperature: 0.5,
          stream: true,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant who uses the following pieces of context to answer the users question.",
            },
            {
              role: "user",
              content: `Use the following pieces of context: ${concatenatedPageContent} to answer the users question: ${question}. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
      \n----------------\n
      PREVIOUS CONVERSATION:
     ${formattedPrevMessages}
      \n----------------\n
      Helpful Answer:`,
            },
          ],
        });
      }
      // console.log(result, "RESULT");

      // const stream = OpenAIStream(result);
      // // console.log(stream);
      const stream = OpenAIStream(result, {
        async onCompletion(completion: any) {
          await db.message.create({
            data: {
              text: completion,
              isUserMessage: false,
              fileId: body.fileId,
              userId: body.userId,
            },
          });
        },
      });
      return new StreamingTextResponse(stream);
    } else {
      //// console.log("There are no matches.");
      return new NextResponse("No Matches", { status: 200 });
    }
  } catch (error) {
    //// console.log("[READ_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
