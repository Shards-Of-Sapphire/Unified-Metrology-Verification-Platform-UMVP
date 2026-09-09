export interface SaveCertificatePdfOptions {
  certId: string;
  pdfData: string;
  certificates: Array<{ id: string; pdfData?: string }>;
  persistLocalState: () => void;
  remoteSave?: () => Promise<void>;
}

export async function saveCertificatePdf({
  certId,
  pdfData,
  certificates,
  persistLocalState,
  remoteSave,
}: SaveCertificatePdfOptions): Promise<{ stored: boolean; fallback: boolean; savedLocally: boolean }> {
  const cert = certificates.find((item) => item.id === certId);
  if (cert) {
    cert.pdfData = pdfData;
    persistLocalState();
    return { stored: true, fallback: true, savedLocally: true };
  }

  if (remoteSave) {
    try {
      await remoteSave();
      return { stored: true, fallback: false, savedLocally: false };
    } catch (error) {
      const certInMemory = certificates.find((item) => item.id === certId);
      if (certInMemory) {
        certInMemory.pdfData = pdfData;
        persistLocalState();
        return { stored: true, fallback: true, savedLocally: true };
      }
      throw error;
    }
  }

  return { stored: false, fallback: false, savedLocally: false };
}
