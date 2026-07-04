-- CreateTable
CREATE TABLE "Faction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emblem" TEXT,
    "description" TEXT,
    "foundedDate" TEXT,
    "colorScheme" TEXT NOT NULL DEFAULT '{}',
    "terminology" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "callsign" TEXT,
    "birthDate" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "height" TEXT,
    "weight" TEXT,
    "rank" TEXT,
    "status" TEXT,
    "description" TEXT,
    "biography" TEXT,
    "quotes" TEXT,
    "abilities" TEXT,
    "inventory" TEXT,
    "image" TEXT,
    "accessLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "factionId" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emblem" TEXT,
    "description" TEXT,
    "foundedDate" TEXT,
    "hierarchy" TEXT,
    "goals" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'city',
    "coordX" DOUBLE PRECISION,
    "coordY" DOUBLE PRECISION,
    "population" TEXT,
    "description" TEXT,
    "accessLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT,
    "coordX" DOUBLE PRECISION,
    "coordY" DOUBLE PRECISION,
    "cause" TEXT,
    "consequences" TEXT,
    "description" TEXT,
    "accessLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'report',
    "content" TEXT,
    "accessLevel" INTEGER NOT NULL DEFAULT 0,
    "damagePercent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'unknown',
    "trustLevel" INTEGER NOT NULL DEFAULT 50,
    "startDate" TEXT,
    "endDate" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "characterAId" TEXT NOT NULL,
    "characterBId" TEXT NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipHistory" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "relationshipId" TEXT NOT NULL,

    CONSTRAINT "RelationshipHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactionView" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '{}',
    "factionId" TEXT NOT NULL,
    "characterId" TEXT,
    "organizationId" TEXT,
    "locationId" TEXT,
    "eventId" TEXT,
    "documentId" TEXT,
    "relationshipId" TEXT,

    CONSTRAINT "FactionView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityLink" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "EntityLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ARGLock" (
    "id" TEXT NOT NULL,
    "keyRequired" TEXT NOT NULL,
    "hint" TEXT,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "ARGLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ARGKey" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "hiddenInDocumentId" TEXT NOT NULL,

    CONSTRAINT "ARGKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectiveTruth" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ObjectiveTruth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "characterId" TEXT,
    "organizationId" TEXT,
    "locationId" TEXT,
    "eventId" TEXT,
    "documentId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterEvent" (
    "characterId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "CharacterEvent_pkey" PRIMARY KEY ("characterId","eventId")
);

-- CreateTable
CREATE TABLE "CharacterDocument" (
    "characterId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "CharacterDocument_pkey" PRIMARY KEY ("characterId","documentId")
);

-- CreateTable
CREATE TABLE "EventLocation" (
    "eventId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "EventLocation_pkey" PRIMARY KEY ("eventId","locationId")
);

-- CreateTable
CREATE TABLE "EventDocument" (
    "eventId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "EventDocument_pkey" PRIMARY KEY ("eventId","documentId")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faction_name_key" ON "Faction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FactionView_entityType_entityId_factionId_key" ON "FactionView"("entityType", "entityId", "factionId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityLink_sourceType_sourceId_targetType_targetId_key" ON "EntityLink"("sourceType", "sourceId", "targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "ARGKey_code_key" ON "ARGKey"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ObjectiveTruth_entityType_entityId_key" ON "ObjectiveTruth"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_characterAId_fkey" FOREIGN KEY ("characterAId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_characterBId_fkey" FOREIGN KEY ("characterBId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationshipHistory" ADD CONSTRAINT "RelationshipHistory_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionView" ADD CONSTRAINT "FactionView_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionView" ADD CONSTRAINT "FactionView_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionView" ADD CONSTRAINT "FactionView_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionView" ADD CONSTRAINT "FactionView_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionView" ADD CONSTRAINT "FactionView_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionView" ADD CONSTRAINT "FactionView_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionView" ADD CONSTRAINT "FactionView_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ARGLock" ADD CONSTRAINT "ARGLock_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ARGKey" ADD CONSTRAINT "ARGKey_hiddenInDocumentId_fkey" FOREIGN KEY ("hiddenInDocumentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterEvent" ADD CONSTRAINT "CharacterEvent_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterEvent" ADD CONSTRAINT "CharacterEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterDocument" ADD CONSTRAINT "CharacterDocument_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterDocument" ADD CONSTRAINT "CharacterDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLocation" ADD CONSTRAINT "EventLocation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLocation" ADD CONSTRAINT "EventLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDocument" ADD CONSTRAINT "EventDocument_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDocument" ADD CONSTRAINT "EventDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
