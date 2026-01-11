import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ChoiceLetter } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      chainSlug,
      parentNodeId,
      parentGuessChoice,
      deviceId,
      statements,
      lieChoice,
      creatorName,
      creatorAvatar,
    } = body;

    if (!chainSlug || !deviceId || !statements || !lieChoice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const node = store.createNode(
      chainSlug,
      parentNodeId || null,
      parentGuessChoice as ChoiceLetter || null,
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
        { error: "Failed to create node. Chain may not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      node: {
        id: node.id,
        chainId: node.chainId,
        creatorName: node.creatorName,
        creatorAvatar: node.creatorAvatar,
      },
    });
  } catch (error) {
    console.error("Error creating node:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
