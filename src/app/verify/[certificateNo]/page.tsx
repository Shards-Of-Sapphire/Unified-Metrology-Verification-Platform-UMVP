"use client";

import { useParams } from "next/navigation";
import VerifyCertificateView from "@/components/migrated/VerifyCertificateView";

export default function CertificateVerificationRoute() {
  const params = useParams<{ certificateNo: string }>();
  return <VerifyCertificateView initialCertificateNo={params.certificateNo} />;
}