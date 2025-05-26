import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Claim {
  claim_id: number;
  mail: string;
  timestamp: string;
  name: string;
  reward_id: number;
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await fetch("/api/admin/claims");
        const data = await res.json();
        setClaims(data);
      } catch (err) {
        console.error("Failed to fetch claims", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClaims();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Claims History</CardTitle>
          <CardDescription>Recent reward claims from users</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.claim_id}>
                    <TableCell className="font-medium">
                      {claim.claim_id}
                    </TableCell>
                    <TableCell>{claim.mail}</TableCell>
                    <TableCell>{claim.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatTimestamp(claim.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
