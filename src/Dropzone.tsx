import { clsx } from "clsx";

export function Dropzone(props: {
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
