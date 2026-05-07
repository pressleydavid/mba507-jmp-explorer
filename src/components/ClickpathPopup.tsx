import { useEffect, useState } from "react";
import type { TreeNode } from "../data/topics";

interface Props {
  node: TreeNode;
  origin: { x: number; y: number };
  onClose: () => void;
}

export function ClickpathPopup({ node, origin, onClose }: Props) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 220);
  };

  // Distance from leaf origin to the popup card's center (viewport center).
  // We pass origin coords as CSS vars so the explode animation starts
  // from the exact leaf position the user clicked.
  const style = {
    ["--ox" as never]: `${origin.x}px`,
    ["--oy" as never]: `${origin.y}px`,
  } as React.CSSProperties;

  return (
    <div
      className={`overlay ${closing ? "closing" : ""}`}
      onClick={close}
      style={style}
    >
      <div
        className="popup-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`pop-${node.id}-title`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="popup-close"
          onClick={close}
          aria-label="Close clickpath"
        >
          ×
        </button>

        <div className="popup-header">
          <div className="popup-eyebrow">JMP clickpath</div>
          <h2 id={`pop-${node.id}-title`} className="popup-title">
            {node.title}
          </h2>
          {node.subtitle && <div className="popup-sub">{node.subtitle}</div>}
        </div>

        <div className="popup-body">
          {node.assumptions && node.assumptions.length > 0 && (
            <Section title="Assumptions / when to use">
              <ul className="assumption-list">
                {node.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Steps">
            <ol className="clickpath">
              {node.clickpath?.map((s, i) => (
                <li
                  key={i}
                  className="cp-step"
                  style={{ animationDelay: `${i * 65 + 80}ms` }}
                >
                  <span className="cp-num">{i + 1}</span>
                  <span className="cp-label">
                    <FormattedPath text={s.label} />
                    {s.hint && <em className="cp-hint">{s.hint}</em>}
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          {node.example && (
            <Section title="Worked example">
              <div className="example">
                <div className="ex-row">
                  <span className="ex-key">Dataset</span>
                  <span className="ex-val">
                    <code>{node.example.dataset}</code>
                  </span>
                </div>
                <div className="ex-row">
                  <span className="ex-key">Y</span>
                  <span className="ex-val">
                    <code>{node.example.response}</code>
                  </span>
                </div>
                {node.example.predictors.length > 0 && (
                  <div className="ex-row">
                    <span className="ex-key">X</span>
                    <span className="ex-val">
                      {node.example.predictors.map((p) => (
                        <code key={p} className="pill">
                          {p}
                        </code>
                      ))}
                    </span>
                  </div>
                )}
                <div className="ex-row">
                  <span className="ex-key">Question</span>
                  <span className="ex-val">{node.example.question}</span>
                </div>
                <div className="ex-row">
                  <span className="ex-key">Expected</span>
                  <span className="ex-val">{node.example.expected}</span>
                </div>
              </div>
            </Section>
          )}

          {node.managerial && (
            <Section title="Managerial interpretation">
              <p className="managerial">{node.managerial}</p>
            </Section>
          )}

          {node.pitfalls && node.pitfalls.length > 0 && (
            <Section title="Common pitfalls">
              <ul className="pitfalls">
                {node.pitfalls.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="popup-section">
      <h3 className="popup-section-title">{title}</h3>
      {children}
    </section>
  );
}

/** Renders "Analyze ▸ Fit Y by X" with each token as a chip, separators dimmed. */
function FormattedPath({ text }: { text: string }) {
  // Treat anything before the first ":" or "(" as the structured path.
  // We split on " ▸ " specifically (the convention used in topics.ts).
  const sepIdx = text.indexOf(" ▸ ");
  if (sepIdx === -1) {
    return <span>{text}</span>;
  }
  // The path portion is the leading run of "X ▸ Y ▸ Z" tokens.
  // Find where the chained menu tokens stop (first segment that doesn't follow ▸).
  const tokens: string[] = [];
  let rest = text;
  // Split greedily on " ▸ "
  const all = text.split(" ▸ ");
  // If the LAST token has a colon or sentence punctuation, treat it as
  // explanatory text rather than a menu item.
  const explanatoryIdx = all.findIndex((t, i) =>
    i > 0 && (t.includes(":") || t.length > 50),
  );
  if (explanatoryIdx === -1) {
    return (
      <span>
        {all.map((t, i) => (
          <span key={i}>
            <span className="path-chip">{t}</span>
            {i < all.length - 1 && <span className="path-sep"> ▸ </span>}
          </span>
        ))}
      </span>
    );
  }
  for (let i = 0; i < explanatoryIdx; i++) tokens.push(all[i]);
  rest = all.slice(explanatoryIdx).join(" ▸ ");
  return (
    <span>
      {tokens.map((t, i) => (
        <span key={i}>
          <span className="path-chip">{t}</span>
          <span className="path-sep"> ▸ </span>
        </span>
      ))}
      <span className="path-tail">{rest}</span>
    </span>
  );
}
