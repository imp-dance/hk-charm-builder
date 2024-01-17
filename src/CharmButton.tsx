import { clsx } from "clsx";
import { CSSProperties, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { charms } from "./charms";
import { Charm } from "./types";

export function CharmButton(props: {
  charm: Charm;
  onClick?: () => void;
  onMouseDown: () => void;
  onMouseUp?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  style?: React.CSSProperties;
  overcharmed?: boolean;
  index?: number;
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] =
    useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] =
    useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        { name: "arrow", options: { element: arrowElement } },
      ],
    }
  );

  return (
    <>
      <button
        ref={setReferenceElement}
        onClick={props.onClick}
        className={clsx("charm-button")}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        style={
          {
            ...props.style,
            "--charm-index": props.index,
          } as CSSProperties
        }
        onMouseOver={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        data-overcharmed={props.overcharmed ?? undefined}
      >
        <img
          src={`./charms/${props.charm}.png`}
          style={{ userSelect: "none" }}
        />
      </button>
      {ReactDOM.createPortal(
        <>
          {tooltipVisible && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              className="popper"
              {...attributes.popper}
            >
              <h3>{charms[props.charm].name}</h3>
              <p>
                {charms[props.charm].description
                  .split("\n")
                  .map((l) => (
                    <p key={l}>{l}</p>
                  ))}
              </p>
              <div ref={setArrowElement} style={styles.arrow} />
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
}
