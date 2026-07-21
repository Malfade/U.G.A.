"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function revalidateArchive() {
  revalidatePath("/", "layout");
}

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (!value || value === "") return null;
  return String(value);
}

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
    factionId: emptyToNull(formData.get("factionId")),
    organizationId: emptyToNull(formData.get("organizationId")),
    accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
    isSecondary: formData.get("isSecondary") === "on" || formData.get("isSecondary") === "true",
  };

  await prisma.character.create({ data });
  revalidateArchive();
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
    factionId: emptyToNull(formData.get("factionId")),
    organizationId: emptyToNull(formData.get("organizationId")),
    accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
    isSecondary: formData.get("isSecondary") === "on" || formData.get("isSecondary") === "true",
  };

  await prisma.character.update({ where: { id }, data });
  revalidateArchive();
  redirect("/admin/characters");
}

export async function deleteCharacter(id: string) {
  await prisma.character.delete({ where: { id } });
  revalidateArchive();
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
  revalidateArchive();
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
  revalidateArchive();
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
  revalidateArchive();
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
  revalidateArchive();
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
  revalidateArchive();
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
  revalidateArchive();
  redirect("/admin/organizations");
}

export async function deleteOrganization(id: string) {
  await prisma.organization.delete({ where: { id } });
  revalidateArchive();
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
  revalidateArchive();
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
  revalidateArchive();
  redirect("/admin/locations");
}

export async function deleteLocation(id: string) {
  await prisma.location.delete({ where: { id } });
  revalidateArchive();
  redirect("/admin/locations");
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidateArchive();
  redirect("/admin/events");
}

export async function deleteDocument(id: string) {
  await prisma.document.delete({ where: { id } });
  revalidateArchive();
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
  revalidateArchive();
  redirect(`/admin/characters/${characterId}`);
}

export async function deleteNote(id: string, characterId: string) {
  await prisma.note.delete({ where: { id } });
  revalidateArchive();
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

  revalidateArchive();
  redirect(adminEntityUrl(entityType, entityId));
}

export async function deleteFactionView(
  id: string,
  entityType: string,
  entityId: string
) {
  await prisma.factionView.delete({ where: { id } });
  revalidateArchive();
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
  revalidateArchive();
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
  revalidateArchive();
  redirect(`/admin/factions/${id}`);
}

export async function deleteFaction(id: string) {
  await prisma.faction.delete({ where: { id } });
  revalidateArchive();
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
  revalidateArchive();
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
  revalidateArchive();
  redirect(`/admin/relationships/${id}`);
}

export async function deleteRelationship(id: string) {
  await prisma.relationship.delete({ where: { id } });
  revalidateArchive();
  redirect("/admin/relationships");
}

export async function createArchiveLink(formData: FormData) {
  const kind = formData.get("kind") as string;
  const sourceId = formData.get("sourceId") as string;
  const targetId = formData.get("targetId") as string;

  if (!kind || !sourceId || !targetId) {
    throw new Error("Не заполнены поля связи");
  }

  switch (kind) {
    case "relationship":
      await prisma.relationship.create({
        data: {
          characterAId: sourceId,
          characterBId: targetId,
          type: (formData.get("relationType") as string) || "unknown",
          trustLevel: parseInt((formData.get("trustLevel") as string) || "50"),
          description: (formData.get("description") as string) || null,
        },
      });
      break;
    case "character_event":
      await prisma.characterEvent.create({
        data: { characterId: sourceId, eventId: targetId },
      });
      break;
    case "event_location":
      await prisma.eventLocation.create({
        data: { eventId: sourceId, locationId: targetId },
      });
      break;
    case "character_document":
      await prisma.characterDocument.create({
        data: { characterId: sourceId, documentId: targetId },
      });
      break;
    case "event_document":
      await prisma.eventDocument.create({
        data: { eventId: sourceId, documentId: targetId },
      });
      break;
    case "character_organization":
      await prisma.character.update({
        where: { id: sourceId },
        data: { organizationId: targetId },
      });
      break;
    case "dialogue_location":
      await prisma.dialogue.update({
        where: { id: sourceId },
        data: { locationId: targetId },
      });
      break;
    case "dialogue_about_character":
      await prisma.dialogue.update({
        where: { id: sourceId },
        data: { aboutCharacterId: targetId },
      });
      break;
    case "dialogue_about_location":
      await prisma.dialogue.update({
        where: { id: sourceId },
        data: { aboutLocationId: targetId },
      });
      break;
    case "organization_event":
      await prisma.entityLink.create({
        data: {
          sourceType: "organization",
          sourceId,
          targetType: "event",
          targetId,
        },
      });
      break;
    case "organization_document":
      await prisma.entityLink.create({
        data: {
          sourceType: "organization",
          sourceId,
          targetType: "document",
          targetId,
        },
      });
      break;
    case "organization_location":
      await prisma.entityLink.create({
        data: {
          sourceType: "organization",
          sourceId,
          targetType: "location",
          targetId,
        },
      });
      break;
    default:
      throw new Error(`Неизвестный тип связи: ${kind}`);
  }

  revalidateArchive();
  redirect("/admin/relationships");
}

/** Encoded id: kind|payload (payload depends on kind) */
export async function deleteArchiveLink(encodedId: string) {
  const [kind, ...rest] = encodedId.split("|");
  const a = rest[0];
  const b = rest[1];

  switch (kind) {
    case "relationship":
      await prisma.relationship.delete({ where: { id: a } });
      break;
    case "character_event":
      await prisma.characterEvent.delete({
        where: { characterId_eventId: { characterId: a, eventId: b } },
      });
      break;
    case "event_location":
      await prisma.eventLocation.delete({
        where: { eventId_locationId: { eventId: a, locationId: b } },
      });
      break;
    case "character_document":
      await prisma.characterDocument.delete({
        where: { characterId_documentId: { characterId: a, documentId: b } },
      });
      break;
    case "event_document":
      await prisma.eventDocument.delete({
        where: { eventId_documentId: { eventId: a, documentId: b } },
      });
      break;
    case "character_organization":
      await prisma.character.update({
        where: { id: a },
        data: { organizationId: null },
      });
      break;
    case "dialogue_location":
      await prisma.dialogue.update({
        where: { id: a },
        data: { locationId: null },
      });
      break;
    case "dialogue_about_character":
      await prisma.dialogue.update({
        where: { id: a },
        data: { aboutCharacterId: null },
      });
      break;
    case "dialogue_about_location":
      await prisma.dialogue.update({
        where: { id: a },
        data: { aboutLocationId: null },
      });
      break;
    case "organization_event":
    case "organization_document":
    case "organization_location":
    case "entity_link":
      await prisma.entityLink.delete({ where: { id: a } });
      break;
    default:
      throw new Error(`Неизвестный тип связи: ${kind}`);
  }

  revalidateArchive();
}

export async function updateArchiveLink(formData: FormData) {
  const linkId = formData.get("linkId") as string;
  if (!linkId) throw new Error("Нет id связи");

  // Remove old link, then create with new endpoints
  await deleteArchiveLink(linkId);

  // Re-create without redirect loop: inline create then redirect
  const kind = formData.get("kind") as string;
  const sourceId = formData.get("sourceId") as string;
  const targetId = formData.get("targetId") as string;

  switch (kind) {
    case "relationship":
      await prisma.relationship.create({
        data: {
          characterAId: sourceId,
          characterBId: targetId,
          type: (formData.get("relationType") as string) || "unknown",
          trustLevel: parseInt((formData.get("trustLevel") as string) || "50"),
          description: (formData.get("description") as string) || null,
        },
      });
      break;
    case "character_event":
      await prisma.characterEvent.create({
        data: { characterId: sourceId, eventId: targetId },
      });
      break;
    case "event_location":
      await prisma.eventLocation.create({
        data: { eventId: sourceId, locationId: targetId },
      });
      break;
    case "character_document":
      await prisma.characterDocument.create({
        data: { characterId: sourceId, documentId: targetId },
      });
      break;
    case "event_document":
      await prisma.eventDocument.create({
        data: { eventId: sourceId, documentId: targetId },
      });
      break;
    case "character_organization":
      await prisma.character.update({
        where: { id: sourceId },
        data: { organizationId: targetId },
      });
      break;
    case "dialogue_location":
      await prisma.dialogue.update({
        where: { id: sourceId },
        data: { locationId: targetId },
      });
      break;
    case "dialogue_about_character":
      await prisma.dialogue.update({
        where: { id: sourceId },
        data: { aboutCharacterId: targetId },
      });
      break;
    case "dialogue_about_location":
      await prisma.dialogue.update({
        where: { id: sourceId },
        data: { aboutLocationId: targetId },
      });
      break;
    case "organization_event":
      await prisma.entityLink.create({
        data: {
          sourceType: "organization",
          sourceId,
          targetType: "event",
          targetId,
        },
      });
      break;
    case "organization_document":
      await prisma.entityLink.create({
        data: {
          sourceType: "organization",
          sourceId,
          targetType: "document",
          targetId,
        },
      });
      break;
    case "organization_location":
      await prisma.entityLink.create({
        data: {
          sourceType: "organization",
          sourceId,
          targetType: "location",
          targetId,
        },
      });
      break;
    default:
      throw new Error(`Неизвестный тип связи: ${kind}`);
  }

  revalidateArchive();
  redirect("/admin/relationships");
}

export async function createEntityField(formData: FormData) {
  const entityType = formData.get("entityType") as string;
  const entityId = formData.get("entityId") as string;
  await prisma.entityField.create({
    data: {
      entityType,
      entityId,
      label: formData.get("label") as string,
      content: (formData.get("content") as string) || "",
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
      sortOrder: parseInt((formData.get("sortOrder") as string) || "0"),
      fullyRedacted: formData.get("fullyRedacted") === "true",
    },
  });
  revalidateArchive();
  redirect(adminEntityUrl(entityType, entityId));
}

export async function updateEntityField(id: string, formData: FormData) {
  const entityType = formData.get("entityType") as string;
  const entityId = formData.get("entityId") as string;
  await prisma.entityField.update({
    where: { id },
    data: {
      label: formData.get("label") as string,
      content: (formData.get("content") as string) || "",
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
      sortOrder: parseInt((formData.get("sortOrder") as string) || "0"),
      fullyRedacted: formData.get("fullyRedacted") === "true",
    },
  });
  revalidateArchive();
  redirect(adminEntityUrl(entityType, entityId));
}

export async function deleteEntityField(
  id: string,
  entityType: string,
  entityId: string
) {
  await prisma.entityField.delete({ where: { id } });
  revalidateArchive();
  redirect(adminEntityUrl(entityType, entityId));
}

interface LineInput {
  speakerId?: string;
  speakerLabel?: string;
  text: string;
}

async function syncDialogueLines(dialogueId: string, linesJson: string | null) {
  await prisma.dialogueLine.deleteMany({ where: { dialogueId } });
  if (!linesJson) return;
  try {
    const lines = JSON.parse(linesJson) as LineInput[];
    if (!Array.isArray(lines)) return;
    let order = 0;
    for (const line of lines) {
      if (!line.text?.trim()) continue;
      await prisma.dialogueLine.create({
        data: {
          dialogueId,
          speakerId: line.speakerId || null,
          speakerLabel: line.speakerLabel || null,
          text: line.text,
          sortOrder: order++,
        },
      });
    }
  } catch {
    // ignore
  }
}

export async function createDialogue(formData: FormData) {
  const dialogue = await prisma.dialogue.create({
    data: {
      title: emptyToNull(formData.get("title")),
      kind: (formData.get("kind") as string) || "dialogue",
      summary: emptyToNull(formData.get("summary")),
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
      locationId: emptyToNull(formData.get("locationId")),
      aboutCharacterId: emptyToNull(formData.get("aboutCharacterId")),
      aboutLocationId: emptyToNull(formData.get("aboutLocationId")),
      factionId: emptyToNull(formData.get("factionId")),
    },
  });
  await syncDialogueLines(dialogue.id, formData.get("lines") as string | null);
  revalidateArchive();
  redirect(`/admin/dialogues/${dialogue.id}`);
}

export async function updateDialogue(id: string, formData: FormData) {
  await prisma.dialogue.update({
    where: { id },
    data: {
      title: emptyToNull(formData.get("title")),
      kind: (formData.get("kind") as string) || "dialogue",
      summary: emptyToNull(formData.get("summary")),
      accessLevel: parseInt((formData.get("accessLevel") as string) || "0"),
      locationId: emptyToNull(formData.get("locationId")),
      aboutCharacterId: emptyToNull(formData.get("aboutCharacterId")),
      aboutLocationId: emptyToNull(formData.get("aboutLocationId")),
      factionId: emptyToNull(formData.get("factionId")),
    },
  });
  await syncDialogueLines(id, formData.get("lines") as string | null);
  revalidateArchive();
  redirect(`/admin/dialogues/${id}`);
}

export async function deleteDialogue(id: string) {
  await prisma.dialogue.delete({ where: { id } });
  revalidateArchive();
  redirect("/admin/dialogues");
}

export async function createClearanceUnlock(formData: FormData) {
  const unlock = await prisma.clearanceUnlock.create({
    data: {
      title: formData.get("title") as string,
      grantsLevel: parseInt((formData.get("grantsLevel") as string) || "1"),
      cipherText: formData.get("cipherText") as string,
      solutionKey: formData.get("solutionKey") as string,
      rewardCode: formData.get("rewardCode") as string,
      hint: emptyToNull(formData.get("hint")),
      dialogueId: emptyToNull(formData.get("dialogueId")),
      documentId: emptyToNull(formData.get("documentId")),
    },
  });
  revalidateArchive();
  redirect(`/admin/unlocks/${unlock.id}`);
}

export async function updateClearanceUnlock(id: string, formData: FormData) {
  await prisma.clearanceUnlock.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      grantsLevel: parseInt((formData.get("grantsLevel") as string) || "1"),
      cipherText: formData.get("cipherText") as string,
      solutionKey: formData.get("solutionKey") as string,
      rewardCode: formData.get("rewardCode") as string,
      hint: emptyToNull(formData.get("hint")),
      dialogueId: emptyToNull(formData.get("dialogueId")),
      documentId: emptyToNull(formData.get("documentId")),
    },
  });
  revalidateArchive();
  redirect(`/admin/unlocks/${id}`);
}

export async function deleteClearanceUnlock(id: string) {
  await prisma.clearanceUnlock.delete({ where: { id } });
  revalidateArchive();
  redirect("/admin/unlocks");
}
