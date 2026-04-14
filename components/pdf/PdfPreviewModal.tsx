"use client";

import { useState, useEffect } from "react";
import { Eye, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { usePdfExport } from "@/hooks/usePdfExport";
import type { ReportData } from "@/lib/pdf/types";

interface PdfPreviewModalProps {
  toolId: string;
  reportData: ReportData;
  trigger?: React.ReactNode;
}

export default function PdfPreviewModal({
  toolId,
  reportData,
  trigger,
}: PdfPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPremiumRequired } = usePdfExport({ toolId });

  const getStatusColor = (status: ReportData["results"][0]["status"]) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800";
      case "fail":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: ReportData["results"][0]["status"]) => {
    switch (status) {
      case "pass":
        return "Kabul";
      case "fail":
        return "Red";
      case "warning":
        return "Uyarı";
      case "info":
        return "Bilgi";
      default:
        return "-";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Önizleme
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF Rapor Önizlemesi
            {isPremiumRequired && (
              <Badge variant="secondary" className="ml-2">
                Premium
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Başlık */}
            <div className="border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                AI Engineers Lab
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 mt-2">
                {reportData.toolName}
              </h2>
              <div className="text-sm text-gray-500 mt-2">
                <p>Tarih: {new Date(reportData.calculationDate).toLocaleDateString("tr-TR")}</p>
                <p>Araç ID: {reportData.toolId}</p>
              </div>
            </div>

            {/* Giriş Parametreleri */}
            {reportData.parameters.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Giriş Parametreleri</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Parametre</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Değer</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Birim</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.parameters.map((param, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{param.label}</td>
                          <td className="border border-gray-300 px-4 py-2">{param.value}</td>
                          <td className="border border-gray-300 px-4 py-2">{param.unit || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Hesaplama Formülleri */}
            {reportData.formulas.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Hesaplama Formülleri</h3>
                <div className="space-y-4">
                  {reportData.formulas.map((formula, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{formula.label}</h4>
                      <code className="block mt-2 p-2 bg-gray-100 rounded text-sm font-mono">
                        {formula.latex}
                      </code>
                      {formula.description && (
                        <p className="text-sm text-gray-600 mt-2">{formula.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sonuçlar */}
            {reportData.results.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Hesaplama Sonuçları</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Parametre</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Sonuç</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Birim</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.results.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{result.label}</td>
                          <td className="border border-gray-300 px-4 py-2">{result.value}</td>
                          <td className="border border-gray-300 px-4 py-2">{result.unit || "-"}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Badge className={getStatusColor(result.status)}>
                              {getStatusText(result.status)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Referans Standartları */}
            {reportData.standards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Referans Standartları</h3>
                <div className="space-y-3">
                  {reportData.standards.map((standard, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{standard.code}</h4>
                      <p className="text-sm text-gray-700 mt-1">{standard.title}</p>
                      {standard.url && (
                        <a
                          href={standard.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                        >
                          {standard.url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notlar */}
            {reportData.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Notlar</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{reportData.notes}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4 text-center text-sm text-gray-500">
              Bu rapor aiengineerslab.com tarafından oluşturulmuştur — sonuçlar standart tabanlıdır
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}