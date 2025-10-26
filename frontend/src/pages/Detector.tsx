import { useState } from "react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export const Detector = () => {
  const [file, setFile] = useState<File | null>(null);
  const [lot, setLot] = useState<string>("12th_avenue");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("lot_id", lot);

      const res = await fetch(`${API_BASE}/upload-plate`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      toast.success("Processed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border rounded-lg shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">
          License Plate Detector
        </h1>

        <select
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select Parking Lot</option>
          <option value="12th_avenue">12th Avenue Garage</option>
          <option value="9th_avenue_east">9th Avenue East</option>
          <option value="9th_avenue_west">9th Avenue West</option>
          <option value="safeauto">SAFEAUTO</option>
          <option value="medical_center">Medical Center</option>
          <option value="old_cannon">Old Cannon</option>
          <option value="neil_avenue">Neil Avenue</option>
          <option value="11th_avenue">11th Avenue</option>
          <option value="ohio_union_north">Ohio Union North</option>
          <option value="ohio_union_south">Ohio Union South</option>
          <option value="gateway">Gateway</option>
          <option value="tuttle">Tuttle</option>
          <option value="northwest">Northwest</option>
          <option value="arps">Arps</option>
          <option value="lane_avenue">Lane Avenue</option>
          <option value="west_lane_avenue">West Lane Avenue</option>
          <option value="james_outpatient">James Outpatient</option>
          <option value="carmack_2_3">Carmack 2/3</option>
          <option value="carmack_4">Carmack 4</option>
          <option value="carmack_5">Carmack 5</option>
          <option value="buckeye_lot">Buckeye Lot</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full p-2 border rounded-md"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition"
        >
          {loading ? "Processing..." : "Upload & Detect"}
        </button>

        {result && (
          <div className="mt-4 text-sm bg-muted p-3 rounded-md">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detector;
