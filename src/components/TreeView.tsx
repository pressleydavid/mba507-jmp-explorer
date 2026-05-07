import { useRef } from "react";
import type { TreeNode } from "../data/topics";

interface Props {
  root: TreeNode;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onLeafClick: (node: TreeNode, origin: { x: number; y: number }) => void;
  activeLeafId: string | null;
}

export function TreeView({
  root,
  expanded,
  onToggle,
  onLeafClick,
  activeLeafId,
}: Props) {
  return (
    <div className="tree-wrap">
      <div className="root-card">
        <div className="root-title">MBA 507 Statistical Method Decision Tree</div>
        <div className="root-sub">{root.subtitle}</div>
        <div className="root-desc">{root.description}</div>
      </div>

      <div className="trunk" />

      <div className="topics-row">
        {root.children?.map((topic) => (
          <TopicColumn
            key={topic.id}
            topic={topic}
            expanded={expanded}
            onToggle={onToggle}
            onLeafClick={onLeafClick}
            activeLeafId={activeLeafId}
          />
        ))}
      </div>
    </div>
  );
}

interface TopicProps {
  topic: TreeNode;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onLeafClick: (node: TreeNode, origin: { x: number; y: number }) => void;
  activeLeafId: string | null;
}

function TopicColumn({
  topic,
  expanded,
  onToggle,
  onLeafClick,
  activeLeafId,
}: TopicProps) {
  const isOpen = expanded.has(topic.id);
  const accent = topic.accent ?? "#5aa9e6";

  return (
    <div
      className={`topic ${isOpen ? "open" : "closed"}`}
      style={{
        // CSS variable consumed by branch/leaf accents
        ["--accent" as never]: accent,
      }}
    >
      <button
        className="topic-card"
        onClick={() => onToggle(topic.id)}
        aria-expanded={isOpen}
      >
        <div className="topic-eyebrow">{topic.title}</div>
        <div className="topic-title">{topic.subtitle}</div>
        <div className="topic-disclose">{isOpen ? "▾ collapse" : "▸ explore"}</div>
      </button>

      {isOpen && (
        <div className="topic-children">
          {topic.children?.map((branch) => (
            <BranchBlock
              key={branch.id}
              branch={branch}
              expanded={expanded}
              onToggle={onToggle}
              onLeafClick={onLeafClick}
              activeLeafId={activeLeafId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BranchProps {
  branch: TreeNode;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onLeafClick: (node: TreeNode, origin: { x: number; y: number }) => void;
  activeLeafId: string | null;
}

function BranchBlock({
  branch,
  expanded,
  onToggle,
  onLeafClick,
  activeLeafId,
}: BranchProps) {
  const isOpen = expanded.has(branch.id);

  return (
    <div className={`branch ${isOpen ? "open" : "closed"}`}>
      <button
        className="branch-card"
        onClick={() => onToggle(branch.id)}
        aria-expanded={isOpen}
      >
        <div className="branch-title">{branch.title}</div>
        {branch.subtitle && (
          <div className="branch-sub">{branch.subtitle}</div>
        )}
        <div className="branch-disclose">{isOpen ? "▾" : "▸"}</div>
      </button>

      {isOpen && (
        <div className="leaves">
          {branch.children?.map((leaf) => (
            <LeafPill
              key={leaf.id}
              leaf={leaf}
              onLeafClick={onLeafClick}
              active={activeLeafId === leaf.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface LeafProps {
  leaf: TreeNode;
  onLeafClick: (node: TreeNode, origin: { x: number; y: number }) => void;
  active: boolean;
}

function LeafPill({ leaf, onLeafClick, active }: LeafProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handle = () => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onLeafClick(leaf, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <button
      ref={ref}
      className={`leaf ${active ? "active" : ""}`}
      onClick={handle}
      aria-label={`Open clickpath for ${leaf.title}`}
    >
      <span className="leaf-icon" aria-hidden>
        ◆
      </span>
      <span className="leaf-body">
        <span className="leaf-title">{leaf.title}</span>
        {leaf.subtitle && <span className="leaf-sub">{leaf.subtitle}</span>}
      </span>
      <span className="leaf-cta" aria-hidden>
        explode →
      </span>
    </button>
  );
}
