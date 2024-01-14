import { clsx } from "clsx";
import { useEffect, useState } from "react";
import "./App.css";
import { ArrowDown } from "./ArrowDown";
import { charm_synergies, charms } from "./charms";

const charmIds = Object.keys(charms) as (keyof typeof charms)[];
const allSynergies = Object.keys(charm_synergies);

function App() {
  const [rejecting, setRejecting] = useState(false);
  const [tries, setTries] = useState(0);
  const [dragItem, setDragItem] = useState<
    keyof typeof charms | null
  >(null);
  const [selectedCharms, setSelectedCharms] = useState<
    (keyof typeof charms)[]
  >([]);
  const { settings, setSettings } = useSettings(
    setSelectedCharms
  );

  const currentNotchCost = selectedCharms.reduce(
    (acc, charm) =>
      acc + charms[charm as keyof typeof charms].notches,
    0
  );

  const overcharmed = currentNotchCost > 11;

  const requestAddCharm = (charm: keyof typeof charms) => {
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
    setSelectedCharms([...selectedCharms, charm]);
  };

  const removeCharm = (charm: keyof typeof charms) => {
    setSelectedCharms((p) => p.filter((i) => i !== charm));
    setTries(0);
  };

  const activeSynergies = allSynergies.filter((synergy) => {
    return charm_synergies[
      synergy as keyof typeof charm_synergies
    ].charms.every((charm) =>
      selectedCharms.includes(charm as keyof typeof charms)
    );
  });

  return (
    <div
      id="app"
      onMouseUp={() => {
        setDragItem(null);
      }}
    >
      <Stack>
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
          {selectedCharms.map((charm) => (
            <CharmButton
              onClick={() => removeCharm(charm)}
              onMouseDown={() => setDragItem(charm)}
              key={charm}
              charm={charm}
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
            if (dragItem) {
              removeCharm(dragItem);
            }
            setDragItem(null);
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
                  key={charm}
                  shift={shouldShift}
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
      <Stack>
        <Section title="Settings">
          <label>
            <input
              type="checkbox"
              checked={settings.hasVoidheart}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hasVoidheart: e.target.checked,
                })
              }
            />
            Has Voidheart
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.hasUnbreakableStrength}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hasUnbreakableStrength: e.target.checked,
                })
              }
            />
            Has Unbreakable Strength
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.hasUnbreakableHeart}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hasUnbreakableHeart: e.target.checked,
                })
              }
            />
            Has Unbreakable Heart
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.hasUnbreakableGreed}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hasUnbreakableGreed: e.target.checked,
                })
              }
            />
            Has Unbreakable Greed
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.banishedGrimm}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  banishedGrimm: e.target.checked,
                })
              }
            />
            Banished the Grimm Troupe
          </label>
        </Section>
        <Section title="Build info">
          {selectedCharms.map((charm) => (
            <div key={charm} className="charm-info">
              <img src={`/charms/${charm}.png`} />
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
      </Stack>
      {dragItem !== null && <DragItem charm={dragItem} active />}
    </div>
  );
}

function Section(props: {
  title: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="section">
      <button
        className={visible ? "open" : "collapsed"}
        onClick={() => setVisible((p) => !p)}
      >
        {props.title} <ArrowDown />
      </button>
      {visible ? props.children : null}
    </div>
  );
}

function DragItem(props: {
  charm: keyof typeof charms;
  active: boolean;
}) {
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
      shift={false}
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

function Stack(props: { children: React.ReactNode }) {
  return <div className="stack">{props.children}</div>;
}

function Dropzone(props: {
  onDrop: () => void;
  children: React.ReactNode;
  overcharmed?: boolean;
  rejecting?: boolean;
  onStopRejecting?: () => void;
  notAllowed?: boolean;
  isDragging?: boolean;
}) {
  return (
    <div
      className={clsx(
        "dropzone",
        props.overcharmed && "overcharmed",
        props.rejecting && "rejecting",
        props.notAllowed && "not-allowed",
        props.isDragging && "dragging"
      )}
      onAnimationEnd={() => props.onStopRejecting?.()}
      onMouseUp={props.onDrop}
    >
      {props.children}
    </div>
  );
}

function CharmButton(props: {
  charm: keyof typeof charms;
  onClick?: () => void;
  onMouseDown: () => void;
  onMouseUp?: () => void;
  shift?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={props.onClick}
      className={clsx(
        "charm-button",
        props.shift && "second-row"
      )}
      title={`${charms[props.charm].name}\n${
        charms[props.charm].description
      }`}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      style={props.style}
    >
      <img src={`/charms/${props.charm}.png`} />
    </button>
  );
}

function ActiveSynergies(props: { synergies: string[] }) {
  return (
    <div className="synergies">
      {props.synergies.map((synergy) => (
        <div key={synergy}>
          <h3>
            {
              charm_synergies[
                synergy as keyof typeof charm_synergies
              ].name
            }
          </h3>
          {charm_synergies[
            synergy as keyof typeof charm_synergies
          ].description
            .split("\n")
            .map((line) => (
              <p>{line}</p>
            ))}
        </div>
      ))}
      {props.synergies.length === 0 && (
        <p>No synergies currently active.</p>
      )}
    </div>
  );
}

function useSettings(
  setSelectedCharms: React.Dispatch<
    React.SetStateAction<(keyof typeof charms)[]>
  >
) {
  const [settings, setSettings] = useState({
    hasVoidheart: true,
    hasUnbreakableStrength: true,
    hasUnbreakableHeart: true,
    hasUnbreakableGreed: true,
    banishedGrimm: false,
  });

  useEffect(() => {
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
  }, [settings]);

  return {
    settings,
    setSettings,
  };
}

function filter(
  charm: keyof typeof charms,
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
