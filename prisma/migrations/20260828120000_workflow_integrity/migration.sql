ALTER TABLE "User" ADD COLUMN "latitude" DECIMAL(9,6), ADD COLUMN "longitude" DECIMAL(9,6);

ALTER TABLE "Applicant" ADD COLUMN "latitude" DECIMAL(9,6), ADD COLUMN "longitude" DECIMAL(9,6);

ALTER TABLE "Application" ADD COLUMN "applicantLatitude" DECIMAL(9,6), ADD COLUMN "applicantLongitude" DECIMAL(9,6);

ALTER TABLE "TestCentre" ADD COLUMN "latitude" DECIMAL(9,6), ADD COLUMN "longitude" DECIMAL(9,6);

ALTER TABLE "Inspection" ADD COLUMN "clientId" TEXT, ADD COLUMN "clientUpdatedAt" TIMESTAMP(3), ADD COLUMN "syncedAt" TIMESTAMP(3), ADD COLUMN "syncVersion" INTEGER NOT NULL DEFAULT 1;
CREATE INDEX "Inspection_clientId_idx" ON "Inspection"("clientId");

ALTER TABLE "Certificate" ADD COLUMN "dataHash" TEXT;
CREATE UNIQUE INDEX "Certificate_dataHash_key" ON "Certificate"("dataHash");
