export function Settings(props: {
  settings: {
    hasVoidheart: boolean;
    hasUnbreakableStrength: boolean;
    hasUnbreakableHeart: boolean;
    hasUnbreakableGreed: boolean;
    banishedGrimm: boolean;
  };
  setSettings: (settings: {
    hasVoidheart: boolean;
    hasUnbreakableStrength: boolean;
    hasUnbreakableHeart: boolean;
    hasUnbreakableGreed: boolean;
    banishedGrimm: boolean;
  }) => void;
}) {
  return (
    <div className="settings-container">
      <label>
        <input
          type="checkbox"
          checked={props.settings.hasVoidheart}
          onChange={(e) =>
            props.setSettings({
              ...props.settings,
              hasVoidheart: e.target.checked,
            })
          }
        />
        Has Voidheart
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.settings.hasUnbreakableStrength}
          onChange={(e) =>
            props.setSettings({
              ...props.settings,
              hasUnbreakableStrength: e.target.checked,
            })
          }
        />
        Has Unbreakable Strength
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.settings.hasUnbreakableHeart}
          onChange={(e) =>
            props.setSettings({
              ...props.settings,
              hasUnbreakableHeart: e.target.checked,
            })
          }
        />
        Has Unbreakable Heart
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.settings.hasUnbreakableGreed}
          onChange={(e) =>
            props.setSettings({
              ...props.settings,
              hasUnbreakableGreed: e.target.checked,
            })
          }
        />
        Has Unbreakable Greed
      </label>
      <label>
        <input
          type="checkbox"
          checked={props.settings.banishedGrimm}
          onChange={(e) =>
            props.setSettings({
              ...props.settings,
              banishedGrimm: e.target.checked,
            })
          }
        />
        Banished the Grimm Troupe
      </label>
    </div>
  );
}
