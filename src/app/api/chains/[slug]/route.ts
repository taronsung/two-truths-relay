import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const chain = store.getChain(slug);

    if (!chain) {
      return NextResponse.json(
        { error: "Chain not found" },
        { status: 404 }
      );
    }

    const treeData = store.getTreeData(slug);

    return NextResponse.json({
      chain: {
        id: chain.id,
        slug: chain.slug,
        title: chain.title,
        createdAt: chain.createdAt,
      },
      tree: treeData,
      stats: {
        nodeCount: chain.nodes.length,
        guessCount: chain.guesses.length,
      },
    });
  } catch (error) {
    console.error("Error fetching chain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
