import { useState } from "react";
import { ArrowDown } from "./ArrowDown";

export function Section(props: {
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
      {visible ? (
        <div className="section-inner">{props.children}</div>
      ) : null}
    </div>
  );
}
