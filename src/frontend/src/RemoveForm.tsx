import "./Form.css";
import Expression from "./Expression";
import type { Expr } from "./App";

export default function RemoveForm({
  exprs,
  selectedIds,
  onClose,
  onSubmit
}: {
  exprs: Expr[];
  onClose: () => void;
  onSubmit: (affectedIds: Set<string>) => void;
  selectedIds: string[];
}) {
  const selected = exprs.find(x => x.id === selectedIds[0]);

  if (!selected) {
    throw new Error("SelectedIds must contain existing expression ID.");
  }

  const childrenMap: Map<string, Set<string>> = new Map();
  exprs.forEach(e => childrenMap.set(e.id, new Set()));
  exprs.forEach(child => child.base_ids.forEach(base => childrenMap.get(base)?.add(child.id)));

  const affectedIds: Set<string> = new Set();
  let frontier: Set<string> = new Set(childrenMap.get(selected.id) ?? []);

  while (frontier.size !== 0) {
    const current = frontier;
    frontier = new Set();

    current.forEach(id => {
      if (!affectedIds.has(id)) {
        affectedIds.add(id);
        childrenMap.get(id)?.forEach(childId => frontier.add(childId));
      }
    });
  }

  const affectedList = Array.from(affectedIds)
    .map(id => exprs.find(e => e.id === id))
    .filter((e): e is Expr => e !== undefined);

  return (
    <div className="modal">
      <div className="form wide-form">
        <div className="list">
          <h3>Are you sure you want to remove expression:</h3>
          <Expression expr={selected} selected={false} onSelect={() => { }} onBoundingChange={() => { }} onMove={() => { }} fixed />
          <p>The expressions below will be removed too:</p>
          {affectedList.map(e => (
            <Expression key={e.id} expr={e} selected={false} onSelect={() => { }} onBoundingChange={() => { }} onMove={() => { }} fixed />
          ))}
        </div>
        <button onClick={() => onSubmit(affectedIds)}>OK</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
