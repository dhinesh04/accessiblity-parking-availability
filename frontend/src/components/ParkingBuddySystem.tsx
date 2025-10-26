import { useState } from "react";
import { Users, Car, ShoppingBag, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ParkingLot } from "@/types/parking";

interface ParkingBuddySystemProps {
  lot?: ParkingLot | null;
}

export function ParkingBuddySystem({ lot }: ParkingBuddySystemProps) {
  const [requestType, setRequestType] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assistanceTypes = [
    { id: "find-car", label: "Help finding my car", icon: Car },
    { id: "loading", label: "Help loading items", icon: ShoppingBag },
    { id: "navigation", label: "Guide me to accessible entrance", icon: Users },
    { id: "other", label: "Other assistance", icon: HelpCircle },
  ];

  const handleSubmit = async () => {
    if (!requestType) {
      toast.error("Please select the type of assistance needed");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to request volunteer assistance
    setTimeout(() => {
      toast.success("Help request sent!", {
        description: "A volunteer will contact you shortly. Expected wait: 5-10 minutes",
      });
      setRequestType("");
      setDetails("");
      setIsSubmitting(false);
    }, 1000);

    // In production, this would make an API call:
    // await fetch('/api/buddy-requests', {
    //   method: 'POST',
    //   body: JSON.stringify({ requestType, details, lot, timestamp: new Date() })
    // });
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Users className="h-6 w-6" aria-hidden="true" />
          Parking Buddy System
        </CardTitle>
        <CardDescription>Request assistance from campus volunteers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={requestType} onValueChange={setRequestType}>
          <div className="space-y-3">
            {assistanceTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={type.id} 
                    id={type.id}
                    aria-label={type.label}
                  />
                  <Label
                    htmlFor={type.id}
                    className="flex items-center gap-2 cursor-pointer text-sm font-normal"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {type.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="details">Additional Details (Optional)</Label>
          <Textarea
            id="details"
            placeholder="e.g., Red Honda Civic near entrance, Row 3..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="resize-none"
            rows={3}
            aria-label="Additional details for assistance request"
          />
        </div>

        {lot && (
          <p className="text-xs text-muted-foreground">
            Location: {lot.lot_name}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!requestType || isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
          aria-label="Request parking assistance"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Requesting Help...
            </>
          ) : (
            <>
              <Users className="mr-2 h-5 w-5" aria-hidden="true" />
              Request Assistance
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Average response time: 5-10 minutes during business hours
        </p>
      </CardContent>
    </Card>
  );
}
