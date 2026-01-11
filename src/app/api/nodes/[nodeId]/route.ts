import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ChoiceLetter } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  try {
    const { nodeId } = await params;
    const { searchParams } = new URL(request.url);
    const chainSlug = searchParams.get("chain");

    if (!chainSlug) {
      return NextResponse.json(
        { error: "Chain slug is required" },
        { status: 400 }
      );
    }

    const node = store.getNode(chainSlug, nodeId);

    if (!node) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      node: {
        id: node.id,
        creatorName: node.creatorName,
        creatorAvatar: node.creatorAvatar,
        statementA: node.statementA,
        statementB: node.statementB,
        statementC: node.statementC,
        createdAt: node.createdAt,
      },
      branchCount: store.getNodeCount(chainSlug),
    });
  } catch (error) {
    console.error("Error fetching node:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  try {
    const { nodeId } = await params;
    const body = await request.json();
    const { chainSlug, deviceId, choice } = body;

    if (!chainSlug || !deviceId || !choice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const node = store.getNode(chainSlug, nodeId);
    if (!node) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    const guess = store.addGuess(
      chainSlug,
      nodeId,
      deviceId,
      choice as ChoiceLetter
    );

    if (!guess) {
      return NextResponse.json(
        { error: "Failed to submit guess" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      guess: {
        id: guess.id,
        choice: guess.choice,
        isCorrect: guess.isCorrect,
      },
      correctChoice: node.lieChoice,
    });
  } catch (error) {
    console.error("Error submitting guess:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
