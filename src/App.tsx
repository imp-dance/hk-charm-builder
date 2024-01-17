import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { ActiveSynergies } from "./ActiveSynergies";
import "./App.css";
import { CharmButton } from "./CharmButton";
import { Dropzone } from "./Dropzone";
import { Section } from "./Section";
import { Settings } from "./Settings";
import { Stack } from "./Stack";
import { charmIds, charm_synergies, charms } from "./charms";
import { Charm } from "./types";
import { getURLState, setURLState } from "./utils";

const allSynergies = Object.keys(charm_synergies);
const initialState = getURLState(
  new URLSearchParams(window.location.search)
);

let cancelRemove = false;

function App() {
  const [rejecting, setRejecting] = useState(false);
  const [tries, setTries] = useState(0);
  const [dragItem, setDragItem] = useState<Charm | null>(null);
  const [selectedCharms, setSelectedCharms] = useState<Charm[]>(
    initialState.charms
  );
  const { settings, setSettings } = useSettings(
    setSelectedCharms
  );

  const currentNotchCost = selectedCharms.reduce(
    (acc, charm) => acc + charms[charm as Charm].notches,
    0
  );

  const overcharmed = currentNotchCost > 11;

  const requestAddCharm = (charm: Charm) => {
    const nextNotchCost =
      charms[charm].notches + currentNotchCost;
    if (overcharmed) {
      return;
    }
    if (currentNotchCost === 11) {
      return;
    }
    if (nextNotchCost > 11 && tries < 2) {
      setTries((p) => p + 1);
      setRejecting(true);
      return;
    } else {
      setTries(0);
    }
    if (selectedCharms.includes(charm)) {
      return;
    }
    const newCharms = [...selectedCharms, charm];
    setSelectedCharms(newCharms);
    setURLState(settings, newCharms);
  };

  const removeCharm = (charm: Charm) => {
    let newCharms = [...selectedCharms];
    setSelectedCharms((p) => {
      newCharms = p.filter((i) => i !== charm);
      return newCharms;
    });
    setURLState(settings, newCharms);
    setTries(0);
  };

  const activeSynergies = allSynergies.filter((synergy) => {
    return charm_synergies[
      synergy as keyof typeof charm_synergies
    ].charms.every((charm) =>
      selectedCharms.includes(charm as Charm)
    );
  });

  useEffect(() => {
    setURLState(settings, selectedCharms);
  }, [settings]);

  return (
    <div
      id="app"
      onMouseUp={() => {
        setDragItem(null);
      }}
    >
      <Stack className="charms-module">
        <Dropzone
          overcharmed={overcharmed}
          rejecting={rejecting}
          onStopRejecting={() => setRejecting(false)}
          notAllowed={
            dragItem !== null && currentNotchCost >= 11
          }
          isDragging={dragItem !== null}
          onDrop={() => {
            if (dragItem) {
              requestAddCharm(dragItem);
              setDragItem(null);
            }
          }}
        >
          {selectedCharms.map((charm, i) => (
            <CharmButton
              onClick={() => removeCharm(charm)}
              onMouseDown={() => setDragItem(charm)}
              key={charm}
              charm={charm}
              overcharmed={overcharmed}
              index={i}
              style={
                dragItem === charm
                  ? {
                      opacity: 0.5,
                      transform: "scale(0.75)",
                    }
                  : {}
              }
            />
          ))}
          {11 > currentNotchCost && (
            <div className="charm-dot-empty-space" />
          )}
        </Dropzone>

        <p className="notches">
          {Array.from({ length: currentNotchCost }).map(
            (_, i) => (
              <div
                className={clsx(
                  "charm-dot",
                  i > 10 && "overcharm"
                )}
                key={i}
              />
            )
          )}
          {Array.from({ length: 11 - currentNotchCost }).map(
            (_, i) => (
              <div className="charm-dot empty" key={i} />
            )
          )}
        </p>

        <div
          className="charms-container"
          onMouseUp={() => {
            if (dragItem && !cancelRemove) {
              removeCharm(dragItem);
            }
            setDragItem(null);
            cancelRemove = false;
          }}
        >
          {charmIds
            .filter((item) => filter(item, settings))
            .map((charm, index) => {
              const shouldShift =
                (index > 9 && index < 20) ||
                (index > 29 && index < 40);
              return (
                <CharmButton
                  onMouseDown={() =>
                    selectedCharms.includes(charm)
                      ? undefined
                      : setDragItem(charm)
                  }
                  onMouseUp={(e) => {
                    if (dragItem === charm) {
                      cancelRemove = true;
                      e.preventDefault();
                      requestAddCharm(charm);
                      setDragItem(null);
                    }
                  }}
                  key={charm}
                  charm={charm}
                  style={
                    dragItem === charm
                      ? {
                          background: "rgba(0,0,0,0.5)",
                          transform: shouldShift
                            ? "translateX(2rem) scale(0.75)"
                            : "scale(0.75)",
                        }
                      : selectedCharms.includes(charm)
                      ? {
                          opacity: 0.25,
                          boxShadow: "0px 0px 10px #fff",
                        }
                      : {}
                  }
                />
              );
            })}
        </div>
      </Stack>
      <div className="subgrid">
        <Section title="Build info">
          {selectedCharms.map((charm) => (
            <div key={charm} className="charm-info">
              <img src={`./charms/${charm}.png`} />
              <div>
                <header>
                  <h3>{charms[charm].name}</h3>
                  <div className="charm-cost">
                    {Array.from({
                      length: charms[charm].notches,
                    }).map((_, i) => (
                      <div className="charm-dot" key={i} />
                    ))}
                  </div>
                </header>
                <p>
                  {charms[charm].description
                    .split("\n")
                    .map((line) => (
                      <p>{line}</p>
                    ))}
                </p>{" "}
              </div>
            </div>
          ))}
        </Section>
        <Section title="Synergies">
          <ActiveSynergies synergies={activeSynergies} />
        </Section>
        <Section title="Settings">
          <Settings
            settings={settings}
            setSettings={setSettings}
          />
        </Section>
      </div>
      {dragItem !== null && <DragItem charm={dragItem} active />}
    </div>
  );
}

function DragItem(props: { charm: Charm; active: boolean }) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const mouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };
  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);
  if (!props.active) {
    return null;
  }
  return (
    <CharmButton
      onMouseDown={() => {}}
      charm={props.charm}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        pointerEvents: "none",
        zIndex: 100,
        opacity: 0.5,
        transform: "translate(-50%, -50%)",
        animation: "scaleInCursor 0.4s ease-in-out",
      }}
    />
  );
}

function useSettings(
  setSelectedCharms: React.Dispatch<
    React.SetStateAction<Charm[]>
  >
) {
  const [settings, setSettings] = useState(
    initialState.settings
  );

  useEffect(
    function consolidateCharmsWithSettings() {
      if (settings.hasVoidheart) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "kingsoul")
        );
      }
      if (!settings.hasVoidheart) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "void_heart")
        );
      }
      if (settings.hasUnbreakableStrength) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "fragile_strength")
        );
      }
      if (!settings.hasUnbreakableStrength) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "unbreakable_strength")
        );
      }
      if (settings.hasUnbreakableHeart) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "fragile_heart")
        );
      }
      if (!settings.hasUnbreakableHeart) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "unbreakable_heart")
        );
      }
      if (settings.hasUnbreakableGreed) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "fragile_greed")
        );
      }
      if (!settings.hasUnbreakableGreed) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "unbreakable_greed")
        );
      }
      if (settings.banishedGrimm) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "grimmchild")
        );
      }
      if (!settings.banishedGrimm) {
        setSelectedCharms((p) =>
          p.filter((i) => i !== "carefree_melody")
        );
      }
    },
    [settings]
  );

  return {
    settings,
    setSettings,
  };
}

function filter(
  charm: Charm,
  settings: {
    hasVoidheart: boolean;
    hasUnbreakableStrength: boolean;
    hasUnbreakableHeart: boolean;
    hasUnbreakableGreed: boolean;
    banishedGrimm: boolean;
  }
) {
  if (settings.hasVoidheart && charm === "kingsoul") {
    return false;
  }
  if (!settings.hasVoidheart && charm === "void_heart") {
    return false;
  }
  if (
    !settings.hasUnbreakableStrength &&
    charm === "unbreakable_strength"
  ) {
    return false;
  }
  if (
    settings.hasUnbreakableStrength &&
    charm === "fragile_strength"
  ) {
    return false;
  }
  if (
    !settings.hasUnbreakableHeart &&
    charm === "unbreakable_heart"
  ) {
    return false;
  }
  if (
    settings.hasUnbreakableHeart &&
    charm === "fragile_heart"
  ) {
    return false;
  }
  if (
    !settings.hasUnbreakableGreed &&
    charm === "unbreakable_greed"
  ) {
    return false;
  }
  if (
    settings.hasUnbreakableGreed &&
    charm === "fragile_greed"
  ) {
    return false;
  }
  if (settings.banishedGrimm && charm === "grimmchild") {
    return false;
  }
  if (!settings.banishedGrimm && charm === "carefree_melody") {
    return false;
  }
  return true;
}

export default App;
