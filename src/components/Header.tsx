interface Props {
  totalLeaves: number;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function Header({ totalLeaves, onExpandAll, onCollapseAll }: Props) {
  return (
    <header className="header">
      <div className="header-title">
        <div className="badge disabled">MBA 506</div>
        <div className="badge active">MBA 507</div>
      </div>
      <div className="header-controls">
<button className="btn ghost" onClick={onExpandAll}>
          Expand all
        </button>
        <button className="btn ghost" onClick={onCollapseAll}>
          Collapse
        </button>
      </div>
    </header>
  );
}
