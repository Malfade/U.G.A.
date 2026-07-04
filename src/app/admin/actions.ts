"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createCharacter(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    callsign: (formData.get("callsign") as string) || null,
    gender: (formData.get("gender") as string) || null,
    birthDate: (formData.get("birthDate") as string) || null,
    age: formData.get("age") ? parseInt(formData.get("age") as string) : null,
    height: (formData.get("height") as string) || null,
    weight: (formData.get("weight") as string) || null,
    rank: (formData.get("rank") as string) || null,
    status: (formData.get("status") as string) || null,
    description: (formData.get("description") as string) || null,
    biography: (formData.get("biography") as string) || null,
    abilities: (formData.get("abilities") as string) || null,
    factionId: (formData.get("factionId") as string) || null,
    accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
  };

  await prisma.character.create({ data });
  redirect("/admin/characters");
}

export async function updateCharacter(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    callsign: (formData.get("callsign") as string) || null,
    gender: (formData.get("gender") as string) || null,
    birthDate: (formData.get("birthDate") as string) || null,
    age: formData.get("age") ? parseInt(formData.get("age") as string) : null,
    height: (formData.get("height") as string) || null,
    weight: (formData.get("weight") as string) || null,
    rank: (formData.get("rank") as string) || null,
    status: (formData.get("status") as string) || null,
    description: (formData.get("description") as string) || null,
    biography: (formData.get("biography") as string) || null,
    abilities: (formData.get("abilities") as string) || null,
    factionId: (formData.get("factionId") as string) || null,
    accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
  };

  await prisma.character.update({ where: { id }, data });
  redirect("/admin/characters");
}

export async function deleteCharacter(id: string) {
  await prisma.character.delete({ where: { id } });
  redirect("/admin/characters");
}

export async function createEvent(formData: FormData) {
  await prisma.event.create({
    data: {
      name: formData.get("name") as string,
      date: (formData.get("date") as string) || null,
      description: (formData.get("description") as string) || null,
      cause: (formData.get("cause") as string) || null,
      consequences: (formData.get("consequences") as string) || null,
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
    },
  });
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  await prisma.event.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      date: (formData.get("date") as string) || null,
      description: (formData.get("description") as string) || null,
      cause: (formData.get("cause") as string) || null,
      consequences: (formData.get("consequences") as string) || null,
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
    },
  });
  redirect("/admin/events");
}

export async function createDocument(formData: FormData) {
  await prisma.document.create({
    data: {
      title: formData.get("title") as string,
      type: (formData.get("type") as string) || "report",
      content: (formData.get("content") as string) || null,
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
      damagePercent: parseInt((formData.get("damagePercent") as string) || "0"),
    },
  });
  redirect("/admin/documents");
}

export async function updateDocument(id: string, formData: FormData) {
  await prisma.document.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      type: (formData.get("type") as string) || "report",
      content: (formData.get("content") as string) || null,
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
      damagePercent: parseInt((formData.get("damagePercent") as string) || "0"),
    },
  });
  redirect("/admin/documents");
}

export async function createOrganization(formData: FormData) {
  await prisma.organization.create({
    data: {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      foundedDate: (formData.get("foundedDate") as string) || null,
      hierarchy: (formData.get("hierarchy") as string) || null,
      goals: (formData.get("goals") as string) || null,
    },
  });
  redirect("/admin/organizations");
}

export async function updateOrganization(id: string, formData: FormData) {
  await prisma.organization.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      foundedDate: (formData.get("foundedDate") as string) || null,
      hierarchy: (formData.get("hierarchy") as string) || null,
      goals: (formData.get("goals") as string) || null,
    },
  });
  redirect("/admin/organizations");
}

export async function deleteOrganization(id: string) {
  await prisma.organization.delete({ where: { id } });
  redirect("/admin/organizations");
}

export async function createLocation(formData: FormData) {
  await prisma.location.create({
    data: {
      name: formData.get("name") as string,
      type: (formData.get("type") as string) || "city",
      coordX: formData.get("coordX") ? parseFloat(formData.get("coordX") as string) : null,
      coordY: formData.get("coordY") ? parseFloat(formData.get("coordY") as string) : null,
      population: (formData.get("population") as string) || null,
      description: (formData.get("description") as string) || null,
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
    },
  });
  redirect("/admin/locations");
}

export async function updateLocation(id: string, formData: FormData) {
  await prisma.location.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      type: (formData.get("type") as string) || "city",
      coordX: formData.get("coordX") ? parseFloat(formData.get("coordX") as string) : null,
      coordY: formData.get("coordY") ? parseFloat(formData.get("coordY") as string) : null,
      population: (formData.get("population") as string) || null,
      description: (formData.get("description") as string) || null,
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
    },
  });
  redirect("/admin/locations");
}

export async function deleteLocation(id: string) {
  await prisma.location.delete({ where: { id } });
  redirect("/admin/locations");
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  redirect("/admin/events");
}

export async function deleteDocument(id: string) {
  await prisma.document.delete({ where: { id } });
  redirect("/admin/documents");
}

export async function createNote(formData: FormData) {
  const characterId = formData.get("characterId") as string;
  await prisma.note.create({
    data: {
      content: formData.get("content") as string,
      author: (formData.get("author") as string) || null,
      characterId,
    },
  });
  redirect(`/admin/characters/${characterId}`);
}

export async function deleteNote(id: string, characterId: string) {
  await prisma.note.delete({ where: { id } });
  redirect(`/admin/characters/${characterId}`);
}

export async function createFactionView(formData: FormData) {
  const entityType = formData.get("entityType") as string;
  const entityId = formData.get("entityId") as string;
  const factionId = formData.get("factionId") as string;
  const content = formData.get("content") as string;

  const linkFields: Record<string, string> = {};
  if (entityType === "character") linkFields.characterId = entityId;
  if (entityType === "event") linkFields.eventId = entityId;
  if (entityType === "organization") linkFields.organizationId = entityId;
  if (entityType === "location") linkFields.locationId = entityId;
  if (entityType === "document") linkFields.documentId = entityId;
  if (entityType === "relationship") linkFields.relationshipId = entityId;

  await prisma.factionView.upsert({
    where: {
      entityType_entityId_factionId: { entityType, entityId, factionId },
    },
    update: { content },
    create: { entityType, entityId, factionId, content, ...linkFields },
  });

  redirect(adminEntityUrl(entityType, entityId));
}

export async function deleteFactionView(
  id: string,
  entityType: string,
  entityId: string
) {
  await prisma.factionView.delete({ where: { id } });
  redirect(adminEntityUrl(entityType, entityId));
}

function adminEntityUrl(entityType: string, entityId: string): string {
  const map: Record<string, string> = {
    character: `/admin/characters/${entityId}`,
    event: `/admin/events/${entityId}`,
    document: `/admin/documents/${entityId}`,
    organization: `/admin/organizations/${entityId}`,
    location: `/admin/locations/${entityId}`,
    relationship: `/admin/relationships/${entityId}`,
  };
  return map[entityType] ?? "/admin";
}

export async function createFaction(formData: FormData) {
  const faction = await prisma.faction.create({
    data: {
      name: formData.get("name") as string,
      emblem: (formData.get("emblem") as string) || null,
      description: (formData.get("description") as string) || null,
      foundedDate: (formData.get("foundedDate") as string) || null,
      colorScheme: (formData.get("colorScheme") as string) || "{}",
      terminology: (formData.get("terminology") as string) || "{}",
    },
  });
  redirect(`/admin/factions/${faction.id}`);
}

export async function updateFaction(id: string, formData: FormData) {
  await prisma.faction.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      emblem: (formData.get("emblem") as string) || null,
      description: (formData.get("description") as string) || null,
      foundedDate: (formData.get("foundedDate") as string) || null,
      colorScheme: (formData.get("colorScheme") as string) || "{}",
      terminology: (formData.get("terminology") as string) || "{}",
    },
  });
  redirect(`/admin/factions/${id}`);
}

export async function deleteFaction(id: string) {
  await prisma.faction.delete({ where: { id } });
  redirect("/admin/factions");
}

interface HistoryInput {
  year: string;
  status: string;
  description?: string;
}

async function syncRelationshipHistory(
  relationshipId: string,
  historyJson: string | null
) {
  await prisma.relationshipHistory.deleteMany({ where: { relationshipId } });
  if (!historyJson) return;

  try {
    const entries = JSON.parse(historyJson) as HistoryInput[];
    if (!Array.isArray(entries)) return;

    for (const entry of entries) {
      if (!entry.year || !entry.status) continue;
      await prisma.relationshipHistory.create({
        data: {
          relationshipId,
          year: entry.year,
          status: entry.status,
          description: entry.description || null,
        },
      });
    }
  } catch {
    // ignore invalid JSON
  }
}

export async function createRelationship(formData: FormData) {
  const relationship = await prisma.relationship.create({
    data: {
      characterAId: formData.get("characterAId") as string,
      characterBId: formData.get("characterBId") as string,
      type: (formData.get("type") as string) || "unknown",
      trustLevel: parseInt((formData.get("trustLevel") as string) || "50"),
      startDate: (formData.get("startDate") as string) || null,
      endDate: (formData.get("endDate") as string) || null,
      description: (formData.get("description") as string) || null,
    },
  });

  await syncRelationshipHistory(
    relationship.id,
    formData.get("history") as string | null
  );
  redirect("/admin/relationships");
}

export async function updateRelationship(id: string, formData: FormData) {
  await prisma.relationship.update({
    where: { id },
    data: {
      characterAId: formData.get("characterAId") as string,
      characterBId: formData.get("characterBId") as string,
      type: (formData.get("type") as string) || "unknown",
      trustLevel: parseInt((formData.get("trustLevel") as string) || "50"),
      startDate: (formData.get("startDate") as string) || null,
      endDate: (formData.get("endDate") as string) || null,
      description: (formData.get("description") as string) || null,
    },
  });

  await syncRelationshipHistory(id, formData.get("history") as string | null);
  redirect(`/admin/relationships/${id}`);
}

export async function deleteRelationship(id: string) {
  await prisma.relationship.delete({ where: { id } });
  redirect("/admin/relationships");
}
