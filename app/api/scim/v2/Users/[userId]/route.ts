import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

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

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
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
    // const orgId = body.orgId;
    console.log(params);
    const id = params.userId.toString();
    console.log(id);
    console.log(orgId);
    if (!orgId) {
      return new NextResponse("Org It is required");
    }
    const user = await db.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        authId: true,
      },
      where: {
        id: params.userId,
        orgId: orgId,
      },
    });
    console.log(user);
    if (!user) {
      return new NextResponse("User with that id could not be found", {
        status: 404,
      });
    }
    const [givenName, familyName] = user.name.split(" ");
    const scimUser: IUserSchema = {
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

    // Return SCIM user object in response
    return new NextResponse(JSON.stringify(scimUser));
  } catch (error) {
    return new NextResponse("Internal Error");
  }
}

// //to update an user
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log(request.body);
    const body = await request.json();
    console.log(body, "BODY BODY BODY");
    console.log("Active from body:", body.active);
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
    console.log(params);
    const id = params.userId.toString();
    console.log(id);
    console.log(orgId);
    if (!orgId) {
      return new NextResponse("Org It is required");
    }
    // Find the user first
    const user = await db.user.findFirst({
      where: {
        id: id,
        orgId: orgId,
      },
    });
    console.log(user);
    // If user not found, return error
    if (!user) {
      return new NextResponse("User with that id could not be found", {
        status: 404,
      });
    }
    const updatedUserRequest: IUserSchema = body;
    console.log(updatedUserRequest.active);
    console.log(updatedUserRequest);
    const { name, emails, active } = updatedUserRequest;
    console.log(name);
    // Find the primary email
    const primaryEmail = emails?.find((email) => email.primary);

    // Construct the full name
    const fullName = `${name?.givenName} ${name?.familyName}`;

    // Update the user with the new data
    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: {
        email: primaryEmail?.value,
        name: fullName,
        active: active,
      },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        authId: true,
      },
    });
    console.log("Updated User info:", updatedUser);

    const [givenName, familyName] = updatedUser.name.split(" ");

    // Prepare the SCIM user object to be returned in the response
    const scimUser: IUserSchema = {
      ...defaultUserSchema,
      id: updatedUser.id.toString(),
      userName: updatedUser.email,
      name: {
        givenName,
        familyName,
      },
      emails: [
        {
          primary: true,
          value: updatedUser.email,
          type: "work",
        },
      ],
      displayName: updatedUser.name,
      externalId: updatedUser.authId,
      active: updatedUser.active ?? false,
    };

    // Return SCIM user object in response
    console.log("USER UPDATED");
    return new NextResponse(JSON.stringify(scimUser));
  } catch (error) {
    return new NextResponse("Internal Error");
  }
}

//soft delete an user
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log(request.body);
    const body = await request.json();
    console.log(body);
    const activeStatus = body.Operations[0].value.active;
    console.log(activeStatus);
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
    console.log(params);
    const id = params.userId.toString();
    console.log(id);
    console.log(orgId);
    if (!orgId) {
      return new NextResponse("Org It is required");
    }

    // Find the user first
    const user = await db.user.findFirst({
      where: {
        id: id,
        orgId: orgId,
      },
    });
    console.log(user);

    // If user not found, return error
    if (!user) {
      return new NextResponse("User with that id could not be found", {
        status: 404,
      });
    }

    // Soft delete the user by setting active to false
    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: {
        active: activeStatus,
      },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        authId: true,
      },
    });

    console.log(updatedUser);
    const [givenName, familyName] = updatedUser.name.split(" ");
    // Prepare the SCIM user object to be returned in the response
    const scimUser: IUserSchema = {
      ...defaultUserSchema,
      id: updatedUser.id.toString(),
      userName: updatedUser.email,
      name: {
        givenName,
        familyName,
      },
      active: updatedUser.active || false,
    };
    console.log("SOFT DELETED USER");
    // Return SCIM user object in response
    return new NextResponse(JSON.stringify(scimUser));
  } catch (error) {
    return new NextResponse("Internal Error");
  }
}

// delete an user
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log(request.body);
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
    console.log(params);
    const id = params.userId.toString();
    console.log(id);
    console.log(orgId);
    if (!orgId) {
      return new NextResponse("Org It is required");
    }
    // Find the user first
    const user = await db.user.findFirst({
      where: {
        id: id,
        orgId: orgId,
      },
    });
    console.log(user);

    // If user not found, return error
    if (!user) {
      return new NextResponse("User with that id could not be found", {
        status: 404,
      });
    }

    await db.user.delete({
      where: {
        id: id,
        orgId: orgId,
      },
    });
    // Return SCIM user object in response
    return new NextResponse("User successfully deleted");
  } catch (error) {
    return new NextResponse("Internal Error while deleting user");
  }
}
