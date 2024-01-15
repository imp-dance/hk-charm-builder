import { clsx } from "clsx";
export function Stack(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("stack", props.className)}>
      {props.children}
    </div>
  );
}
