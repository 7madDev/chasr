"use client";

import { useEffect } from "react";
import { trackView } from "@/app/actions/view";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackView(slug);
  }, [slug]);

  return null;
}
