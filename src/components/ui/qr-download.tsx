"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface QRDownloadProps {
  ticketNumber: string;
  qrCode: string;
  locationName?: string;
  serviceName?: string;
  estimatedWait?: number;
}

export function QRDownload({
  ticketNumber,
  qrCode,
  locationName = "RSUP Dr. Hasan Sadikin Bandung",
  serviceName = "Poliklinik Terpadu",
  estimatedWait,
}: QRDownloadProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQRImage = async (): Promise<string> => {
    try {
      const qrDataUrl = await QRCode.toDataURL(qrCode, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return qrDataUrl;
    } catch (error) {
      console.error("Error generating QR:", error);
      return "";
    }
  };

  const downloadAsJPG = async () => {
    try {
      const qrImage = await generateQRImage();
      if (!qrImage) return;

      // Create canvas for JPG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 1000;

      // White background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = "#00A69E";
      ctx.fillRect(0, 0, canvas.width, 120);

      // Title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText("ANTREAN RSHS BANDUNG", canvas.width / 2, 75);

      // QR Code
      const qrImg = new Image();
      qrImg.src = qrImage;
      await new Promise((resolve) => {
        qrImg.onload = resolve;
      });

      const qrSize = 400;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 180;
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Ticket Info
      ctx.fillStyle = "#000000";
      ctx.font = "bold 48px Arial";
      ctx.fillText(`Tiket: ${ticketNumber}`, canvas.width / 2, qrY + qrSize + 80);

      ctx.font = "24px Arial";
      ctx.fillStyle = "#666666";
      ctx.fillText(locationName, canvas.width / 2, qrY + qrSize + 130);
      ctx.fillText(serviceName, canvas.width / 2, qrY + qrSize + 170);

      if (estimatedWait) {
        ctx.fillStyle = "#00A69E";
        ctx.font = "bold 28px Arial";
        ctx.fillText(
          `Estimasi Tunggu: ${estimatedWait} menit`,
          canvas.width / 2,
          qrY + qrSize + 230
        );
      }

      // Footer
      ctx.fillStyle = "#999999";
      ctx.font = "16px Arial";
      ctx.fillText(
        "Tunjukkan QR ini di loket pendaftaran",
        canvas.width / 2,
        canvas.height - 50
      );

      // Download
      const link = document.createElement("a");
      link.download = `antrean-${ticketNumber}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (error) {
      console.error("Error downloading JPG:", error);
    }
  };

  const downloadAsPDF = async () => {
    try {
      if (!qrRef.current) return;

      const canvas = await html2canvas(qrRef.current, {
        scale: 2,
        backgroundColor: "#FFFFFF",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Header
      pdf.setFillColor(0, 166, 158);
      pdf.rect(0, 0, pdfWidth, 30, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("ANTREAN RSHS BANDUNG", pdfWidth / 2, 20, {
        align: "center",
      });

      // QR Image
      const qrImage = await generateQRImage();
      if (qrImage) {
        const qrSize = 120;
        const qrX = (pdfWidth - qrSize) / 2;
        pdf.addImage(qrImage, "PNG", qrX, 40, qrSize, qrSize);
      }

      // Ticket Info
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(32);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Tiket: ${ticketNumber}`, pdfWidth / 2, 180, {
        align: "center",
      });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(locationName, pdfWidth / 2, 200, { align: "center" });
      pdf.text(serviceName, pdfWidth / 2, 210, { align: "center" });

      if (estimatedWait) {
        pdf.setTextColor(0, 166, 158);
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `Estimasi Tunggu: ${estimatedWait} menit`,
          pdfWidth / 2,
          230,
          { align: "center" }
        );
      }

      // Footer
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(10);
      pdf.text(
        "Tunjukkan QR ini di loket pendaftaran RSHS Bandung",
        pdfWidth / 2,
        pdfHeight - 20,
        { align: "center" }
      );

      pdf.save(`antrean-${ticketNumber}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* QR Preview (hidden, for PDF generation) */}
      <div ref={qrRef} className="hidden">
        <div className="w-[400px] p-8 bg-white">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-[#00A69E]">ANTREAN RSHS</h2>
            <div className="text-xl font-semibold">{ticketNumber}</div>
            <div className="text-sm text-gray-600">{locationName}</div>
            <div className="text-sm text-gray-600">{serviceName}</div>
            {estimatedWait && (
              <div className="text-lg font-bold text-[#00A69E]">
                Estimasi: {estimatedWait} menit
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 rounded-full"
          onClick={downloadAsJPG}
        >
          Download JPG
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1 rounded-full bg-[#00A69E] hover:bg-[#008F88]"
          onClick={downloadAsPDF}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}
