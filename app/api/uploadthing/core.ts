import { db } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getPineconeClient } from "@/lib/pinecone";
import getCurrentUser from "@/actions/getCurrentuser";
import { getUserSubscriptionPlan } from "@/lib/getPlan";

// import { getUserSubscriptionPlan } from "@/lib/stripe";
// import { PLANS } from "@/src/config/stripe";
type SubscriptionPlan = "FREE" | "PRO" | "ENTERPRISE";

const f = createUploadthing();

const middleware = async () => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan({ userId: user.id });

  const orgId = user.orgId;
  return { subscriptionPlan, userId: user.id, orgId };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  // console.log(metadata);
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileExist) return;
  // console.log("1");
  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
      uploadStatus: "PROCESSING",
      orgId: metadata.orgId,
    },
  });
  // console.log("2: File created");
  try {
    const response = await fetch(
      `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
    );

    const blob = await response.blob();

    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();

    const pagesAmt = pageLevelDocs.length;

    const { subscriptionPlan } = metadata;
    // console.log("CHECKING PAGES");
    // Define the maximum pages for each subscription plan
    const maxPages: Record<SubscriptionPlan, number> = {
      FREE: 1,
      PRO: 2,
      ENTERPRISE: 5,
    };

    // Check if the pages amount exceeds the limit for the subscription plan
    const isPageLimitExceeded =
      pagesAmt > maxPages[subscriptionPlan as SubscriptionPlan];

    if (isPageLimitExceeded) {
      await db.file.update({
        data: {
          uploadStatus: "LIMITEXCEED",
          pageAmt: pagesAmt,
        },
        where: {
          id: createdFile.id,
        },
      });
    } else {
      await db.file.update({
        data: {
          uploadStatus: "SUCCESS",
          pageAmt: pagesAmt,
          indexStatus: false,
        },
        where: {
          id: createdFile.id,
        },
      });
    }
  } catch (err) {
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
