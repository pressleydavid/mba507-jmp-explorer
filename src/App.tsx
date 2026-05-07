import { useEffect, useMemo, useState } from "react";
import { tree, type TreeNode } from "./data/topics";
import { TreeView } from "./components/TreeView";
import { ClickpathPopup } from "./components/ClickpathPopup";
import { Header } from "./components/Header";

interface PopupState {
  node: TreeNode;
  origin: { x: number; y: number };
}

export default function App() {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(tree.children?.map((c) => c.id) ?? []),
  );

  const totalLeaves = useMemo(() => countLeaves(tree), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopup(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const ids = new Set<string>();
    walk(tree, (n) => {
      if (n.children?.length) ids.add(n.id);
    });
    setExpanded(ids);
  };

  const collapseAll = () => {
    setExpanded(new Set([tree.id]));
  };

  return (
    <div className="app-shell">
      <Header
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />
      <main className="canvas">
        <TreeView
          root={tree}
          expanded={expanded}
          onToggle={toggle}
          onLeafClick={(node, origin) => setPopup({ node, origin })}
          activeLeafId={popup?.node.id ?? null}
        />
      </main>
      {popup && (
        <ClickpathPopup
          node={popup.node}
          origin={popup.origin}
          onClose={() => setPopup(null)}
        />
      )}
      <footer className="footer">
        <span>MBA 507 · Donnie Hale, Ph.D.</span>
        <a
          className="companion-link"
          href="https://dhale-2025.github.io/Data_Driven_Managerial_Decisions2/"
          target="_blank"
          rel="noreferrer"
        >
          Companion Text: Data-Driven Managerial Decisions 2
        </a>
      </footer>
    </div>
  );
}

function countLeaves(n: TreeNode): number {
  if (!n.children?.length) return n.kind === "leaf" ? 1 : 0;
  return n.children.reduce((acc, c) => acc + countLeaves(c), 0);
}

function walk(n: TreeNode, cb: (n: TreeNode) => void) {
  cb(n);
  n.children?.forEach((c) => walk(c, cb));
}
