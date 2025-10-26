import { Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingLot } from "@/types/parking";

interface EmergencyContactProps {
  lot?: ParkingLot | null;
}

export function EmergencyContact({ lot }: EmergencyContactProps) {
  // Default OSU parking services contact
  const SECURITY_PHONE = "614-292-6677"; // OSU Transportation Services
  const lotName = lot?.lot_name || "this location";

  const callSecurity = () => {
    window.location.href = `tel:${SECURITY_PHONE}`;
  };

  const sendSMS = () => {
    const message = encodeURIComponent(
      `I need assistance at ${lotName}. ${lot ? `Location: ${lot.latitude}, ${lot.longitude}` : ''}`
    );
    window.location.href = `sms:${SECURITY_PHONE}?body=${message}`;
  };

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-700">Emergency Contact</CardTitle>
        <CardDescription>OSU Parking & Transportation Services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={callSecurity}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold h-14"
          aria-label="Call parking security"
        >
          <Phone className="mr-2 h-6 w-6" aria-hidden="true" />
          Call Now: {SECURITY_PHONE}
        </Button>
        <Button
          onClick={sendSMS}
          variant="outline"
          className="w-full border-red-300 text-red-700 hover:bg-red-50 h-12"
          aria-label="Text parking security"
        >
          <MessageSquare className="mr-2 h-5 w-5" aria-hidden="true" />
          Send Text Message
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Available 24/7 for parking assistance and emergencies
        </p>
      </CardContent>
    </Card>
  );
}
