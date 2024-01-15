import { charm_synergies } from "./charms";

type Synergy = keyof typeof charm_synergies;

export function ActiveSynergies(props: { synergies: string[] }) {
  return (
    <div className="synergies">
      {props.synergies.map((synergy) => (
        <div key={synergy}>
          <h3>{charm_synergies[synergy as Synergy].name}</h3>
          {charm_synergies[synergy as Synergy].description
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
