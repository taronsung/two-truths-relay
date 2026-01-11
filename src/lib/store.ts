import { ChoiceLetter, Node, Chain, Guess } from "@/types";
import { generateSlug } from "./utils";

type StoredChain = Chain & { nodes: Node[]; guesses: Guess[] };

const chains = new Map<string, StoredChain>();

export const store = {
  createChain(deviceId: string, title?: string): Chain {
    const chain: Chain = {
      id: crypto.randomUUID(),
      slug: generateSlug(8),
      title: title || "Untitled Relay",
      createdAt: new Date(),
      createdByDeviceId: deviceId,
    };
    
    chains.set(chain.slug, { ...chain, nodes: [], guesses: [] });
    return chain;
  },

  getChain(slug: string): StoredChain | null {
    return chains.get(slug) || null;
  },

  createNode(
    chainSlug: string,
    parentNodeId: string | null,
    parentGuessChoice: ChoiceLetter | null,
    deviceId: string,
    data: {
      statements: [string, string, string];
      lieChoice: ChoiceLetter;
      creatorName: string;
      creatorAvatar: string;
    }
  ): Node | null {
    const chain = chains.get(chainSlug);
    if (!chain) return null;

    const node: Node = {
      id: crypto.randomUUID(),
      chainId: chain.id,
      parentNodeId,
      parentGuessChoice,
      creatorDeviceId: deviceId,
      creatorName: data.creatorName,
      creatorAvatar: data.creatorAvatar,
      statementA: data.statements[0],
      statementB: data.statements[1],
      statementC: data.statements[2],
      lieChoice: data.lieChoice,
      createdAt: new Date(),
      status: "active",
    };

    chain.nodes.push(node);
    return node;
  },

  getNode(chainSlug: string, nodeId: string): Node | null {
    const chain = chains.get(chainSlug);
    if (!chain) return null;
    return chain.nodes.find((n) => n.id === nodeId) || null;
  },

  getRootNode(chainSlug: string): Node | null {
    const chain = chains.get(chainSlug);
    if (!chain) return null;
    return chain.nodes.find((n) => n.parentNodeId === null) || null;
  },

  addGuess(
    chainSlug: string,
    nodeId: string,
    deviceId: string,
    choice: ChoiceLetter
  ): Guess | null {
    const chain = chains.get(chainSlug);
    if (!chain) return null;

    const node = chain.nodes.find((n) => n.id === nodeId);
    if (!node) return null;

    const existingGuess = chain.guesses.find(
      (g) => g.nodeId === nodeId && g.guesserDeviceId === deviceId
    );
    if (existingGuess) return existingGuess;

    const guess: Guess = {
      id: crypto.randomUUID(),
      nodeId,
      guesserDeviceId: deviceId,
      choice,
      isCorrect: choice === node.lieChoice,
      createdAt: new Date(),
    };

    chain.guesses.push(guess);
    return guess;
  },

  getTreeData(chainSlug: string) {
    const chain = chains.get(chainSlug);
    if (!chain) return null;

    const buildTree = (nodeId: string | null): any => {
      const nodes = chain.nodes.filter((n) => 
        nodeId === null ? n.parentNodeId === null : n.parentNodeId === nodeId
      );

      return nodes.map((node) => ({
        ...node,
        children: buildTree(node.id),
        guessCount: chain.guesses.filter((g) => g.nodeId === node.id).length,
        correctGuessCount: chain.guesses.filter(
          (g) => g.nodeId === node.id && g.isCorrect
        ).length,
      }));
    };

    const roots = buildTree(null);
    if (roots.length === 0) return null;

    return {
      root: roots[0],
      totalNodes: chain.nodes.length,
      totalBranches: chain.nodes.filter((n) => n.parentNodeId !== null).length,
    };
  },

  getNodeCount(chainSlug: string): number {
    const chain = chains.get(chainSlug);
    return chain?.nodes.length || 0;
  },
};
