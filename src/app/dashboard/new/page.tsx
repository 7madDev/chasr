import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { NewGoalWizard } from "./NewGoalWizard";

export const metadata: Metadata = {
  title: "Create a Goal",
};

export default async function NewGoalPage() {
  const user = await requireAuth();

  return <NewGoalWizard />;
}
