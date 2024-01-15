import { charmIds } from "./charms";
import { Charm } from "./types";

export function getURLState(params: URLSearchParams) {
  const save = params.get("save");

  if (!save) {
    return {
      settings: {
        hasVoidheart: true,
        hasUnbreakableStrength: true,
        hasUnbreakableHeart: true,
        hasUnbreakableGreed: true,
        banishedGrimm: false,
      },
      charms: [],
    };
  }

  const [settings, _charms] = save.split("_") ?? [];
  const [
    raw_hasVoidheart,
    raw_hasUnbreakableStrength,
    raw_hasUnbreakableHeart,
    raw_hasUnbreakableGreed,
    raw_banishedGrimm,
  ] = settings?.split("") ?? [];

  const charmNames =
    _charms
      ?.split("-")
      .map((c) => parseInt(c))
      .map((c) => charmIds[c]) ?? [];
  const hasVoidheart = raw_hasVoidheart === "1";
  const hasUnbreakableStrength =
    raw_hasUnbreakableStrength === "1";
  const hasUnbreakableHeart = raw_hasUnbreakableHeart === "1";
  const hasUnbreakableGreed = raw_hasUnbreakableGreed === "1";
  const banishedGrimm = raw_banishedGrimm === "1";

  return {
    settings: {
      hasVoidheart,
      hasUnbreakableStrength,
      hasUnbreakableHeart,
      hasUnbreakableGreed,
      banishedGrimm,
    },
    charms: charmNames,
  };
}

export function setURLState(
  settings: {
    hasVoidheart: boolean;
    hasUnbreakableStrength: boolean;
    hasUnbreakableHeart: boolean;
    hasUnbreakableGreed: boolean;
    banishedGrimm: boolean;
  },
  charmNames: Charm[]
) {
  const params = new URLSearchParams();
  const activeCharmIds = charmNames.map((c) =>
    charmIds.indexOf(c)
  );
  const settingsString = [
    settings.hasVoidheart ? "1" : "0",
    settings.hasUnbreakableStrength ? "1" : "0",
    settings.hasUnbreakableHeart ? "1" : "0",
    settings.hasUnbreakableGreed ? "1" : "0",
    settings.banishedGrimm ? "1" : "0",
  ].join("");
  params.set(
    "save",
    `${settingsString}_${activeCharmIds.join("-")}`
  );

  window.history.replaceState({}, "", `?${params.toString()}`);
  return params;
}
