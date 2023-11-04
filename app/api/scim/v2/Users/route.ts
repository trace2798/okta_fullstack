import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface IUserSchema {
  schemas: string[];
  userName?: string;
  id?: string;
  name?: {
    givenName: string;
    familyName: string;
  };
  emails?: { primary: boolean; value: string; type: string }[];
  displayName?: string;
  locale?: string;
  meta?: {
    resourceType: string;
  };
  externalId?: string; // auth0 user id
  groups?: [];
  password?: string;
  active?: boolean; // active status
  detail?: string;
  status?: number;
  imageUrl?: string; // image URL
}
const defaultUserSchema: IUserSchema = {
  schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
  locale: "en-US",
  groups: [],
  meta: {
    resourceType: "User",
  },
};

export async function GET(req: NextRequest) {
  try {
    const headersList = headers();
    console.log(headersList);
    const api = headersList.get("authorization");
    console.log(api);
    if (!api) {
      return new NextResponse("API KEY is required");
    }
    const apiKey = api.split(" ")[1];
    console.log(apiKey);
    const org = await db.org.findFirst({
      where: {
        apikey: apiKey,
      },
      select: {
        id: true,
      },
    });
    console.log(org);
    if (!org) {
      return new NextResponse("Organization not found", {
        status: 404,
      });
    }

    const orgId = org.id;
    console.log(orgId);
    if (!orgId) {
      return new NextResponse("Org It is required");
    }

    const DEFAULT_START_INDEX = "1";
    const DEFAULT_RECORD_LIMIT = "100";
    // let reqQuery = { ...(req as any).query };
    let reqQuery = req.nextUrl.searchParams;
    console.log(reqQuery);
    console.log(reqQuery);
    let startIndex = parseInt(
      reqQuery.get("startIndex") ?? DEFAULT_START_INDEX
    );
    console.log(startIndex);
    startIndex--;
    const recordLimit = parseInt(reqQuery.get("count") ?? DEFAULT_RECORD_LIMIT);
    // console.log(recordLimit);
    // Add these lines for filtering
    let filterQuery: string | null = (reqQuery.get("filter") as string) ?? null;
    console.log(filterQuery);
    let filterParams: string[] = [];
    let email = null;
    console.log(filterQuery);
    if (!!filterQuery) {
      filterParams = filterQuery.split(" ");
      console.log(filterParams);
      const FILTER_EXPRESSION_LENGTH = 3;
      const FILTER_ATTRIBUTE_NAME = 0;
      const FILTER_OPERATOR = 1;
      const FILTER_VALUE = 2;

      if (
        filterParams.length !== FILTER_EXPRESSION_LENGTH ||
        filterParams[FILTER_ATTRIBUTE_NAME] !== "userName" ||
        filterParams[FILTER_OPERATOR] !== "eq"
      ) {
        filterParams = [];
        filterQuery = null;
        console.log(filterParams);
      } else {
        email = filterParams[FILTER_VALUE].replaceAll('"', "");
        console.log("Filter Detected: userName EQ ", email);
      }
    }

    let where: { orgId: string; email?: string } = {
      orgId: orgId,
    };

    if (!!email) {
      where = { ...where, email };
    }

    // Get all users from the organization
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        authId: true,
      },
      where,
    });

    console.log(users);

    // Convert each user to SCIM format
    const scimUsers = users.map((user) => {
      // console.log("1");
      const [givenName, familyName] = user.name.split(" ");
      return {
        ...defaultUserSchema,
        id: user.id.toString(),
        userName: user.email,
        name: {
          givenName,
          familyName,
        },
        emails: [
          {
            primary: true,
            value: user.email,
            type: "work",
          },
        ],
        displayName: user.name,
        externalId: user.authId,
        active: user.active || false,
      };
    });
    const usersResponse = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
      totalResults: scimUsers.length,
      startIndex: startIndex + 1, // adjust for 1-based indexing
      itemsPerPage: recordLimit,
      Resources: scimUsers,
    };

    // Return SCIM ListResponse object in response
    return new NextResponse(JSON.stringify(usersResponse));
  } catch (error) {
    return new NextResponse("Internal Error");
  }
}

// Add a new user
export async function POST(request: Request) {
  try {
    console.log(request.body);
    const body = await request.json();
    console.log(body);
    const email = body.emails[0].value;
    console.log(email);
    const headersList = headers();
    console.log(headersList);
    const api = headersList.get("authorization");
    console.log(api);
    if (!api) {
      return new NextResponse("API KEY is required");
    }
    const apiKey = api.split(" ")[1];
    console.log(apiKey);
    const org = await db.org.findFirst({
      where: {
        apikey: apiKey,
      },
      select: {
        id: true,
      },
    });
    console.log(org);
    if (!org) {
      return new NextResponse("Organization not found", {
        status: 404,
      });
    }

    const orgId = org.id;

    console.log(orgId);
    if (!orgId) {
      return new NextResponse("Org It is required");
    }

    // Find the user first
    const checkUser = await db.user.findFirst({
      where: {
        email: email,
        orgId: orgId,
      },
    });
    console.log(checkUser);
    if (checkUser) {
      return new NextResponse(
        "User with that email account already exist in this organization"
      );
    }
    console.log("HERE");

    const newUser = await db.user.create({
      data: {
        name: `${body.name.givenName} ${body.name.familyName}`,
        authId: body.externalId,
        email: email,
        imageUrl: body.imageUrl,
        orgId: orgId,
        userType: body.userTeam,
        active: body.active,
      },
    });
    console.log(newUser);

    console.log("Account Created ID: ", newUser.id);
    const [givenName, familyName] = newUser.name.split(" ");

    // Prepare the SCIM user object to be returned in the response
    const scimUser: IUserSchema = {
      ...defaultUserSchema,
      id: newUser.id.toString(),
      userName: newUser.email,
      name: {
        givenName,
        familyName,
      },
      emails: [
        {
          primary: true,
          value: newUser.email,
          type: "work",
        },
      ],
      displayName: newUser.name,
      externalId: newUser.authId!,
      active: newUser.active || false,
    };

    return new NextResponse(JSON.stringify(scimUser));
    // return new NextResponse("USER created");
  } catch (error) {
    return new NextResponse("Internal Error creating an user");
  }
}
