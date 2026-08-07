import { useQuery } from "@tanstack/react-query";

async function getCabins() {
  const res = await fetch("/api/cabins");
  if (!res.ok) throw new Error("Failed to fetch cabins");
  return res.json();
}

export function useCabins() {
  const { isLoading, data: cabins, error } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return { isLoading, error, cabins };
}

// Usage:
// const { isLoading, cabins, error } = useCabins();
