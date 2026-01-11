import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbChain = {
  id: string;
  slug: string;
  title: string | null;
  created_at: string;
  created_by_device_id: string;
  privacy: "link_only" | "public" | "private";
};

export type DbNode = {
  id: string;
  chain_id: string;
  parent_node_id: string | null;
  parent_guess_choice: "A" | "B" | "C" | null;
  creator_device_id: string;
  creator_name: string | null;
  creator_avatar: string | null;
  statement_a: string;
  statement_b: string;
  statement_c: string;
  lie_choice: "A" | "B" | "C";
  created_at: string;
  status: "active" | "removed" | "flagged";
};

export type DbGuess = {
  id: string;
  node_id: string;
  guesser_device_id: string;
  choice: "A" | "B" | "C";
  is_correct: boolean;
  created_at: string;
};

export type DbEvent = {
  id: string;
  chain_id: string;
  type: "invite_opened" | "guess_submitted" | "node_created" | "node_reported";
  actor_device_id: string | null;
  node_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};
