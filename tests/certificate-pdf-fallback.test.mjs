import test from 'node:test';
import assert from 'node:assert/strict';

import { saveCertificatePdf } from '../src/lib/certificate-pdf.ts';

test('saveCertificatePdf stores PDF locally when DB storage is unavailable', async () => {
  const certificates = [{
    id: 'CERT-TEST-101',
    certificateNumber: 'LM-TEST-101',
    pdfData: undefined,
  }];

  const result = await saveCertificatePdf({
    certificates,
    certId: 'CERT-TEST-101',
    pdfData: 'JVBERi0xLjQK',
    persistLocalState: () => {
      certificates[0].pdfData = 'JVBERi0xLjQK';
    },
  });

  assert.equal(result.savedLocally, true);
  assert.equal(certificates[0].pdfData, 'JVBERi0xLjQK');
});
