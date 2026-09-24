"use client";

import { useEffect, useState } from "react";
import { Collection } from "../types";
import { collectionService } from "../services/collectionService";

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    collectionService
      .getCollections()
      .then((res) => setCollections(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return { collections, loading };
}
