import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ChoiceLetter } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, title, statements, lieChoice, creatorName, creatorAvatar } = body;

    if (!deviceId || !statements || !lieChoice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const chain = store.createChain(deviceId, title);

    const node = store.createNode(
      chain.slug,
      null,
      null,
      deviceId,
      {
        statements: statements as [string, string, string],
        lieChoice: lieChoice as ChoiceLetter,
        creatorName: creatorName || "Anonymous",
        creatorAvatar: creatorAvatar || "🌸",
      }
    );

    if (!node) {
      return NextResponse.json(
        { error: "Failed to create node" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      chain: {
        id: chain.id,
        slug: chain.slug,
        title: chain.title,
      },
      node: {
        id: node.id,
      },
    });
  } catch (error) {
    console.error("Error creating chain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
