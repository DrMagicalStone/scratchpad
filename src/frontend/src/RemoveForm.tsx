import { useState } from "react";
import "./Form.css";
import Expression from "./Expression";
import type { Expr } from "./App";

export default function SolveForm({
    exprs,
    selectedIds,
    onClose,
    onSubmit
}: {
    exprs: Expr[];
    onClose: () => void;
    onSubmit: (content: Set<Expr | undefined>) => void;
    selectedIds: string[];
}) {

    let selected = exprs.find(x => x.id === selectedIds[0]);

    if (!selected) {
        throw "SelectedIds must contain exist expr's ID.";
    }

    let children_map: Map<string, Set<string>> = new Map();

    exprs.forEach(e => children_map.set(e.id, new Set()));

    exprs.forEach(c => c.base_ids.forEach(b => children_map.get(b)?.add(c.id)));

    let affected: Set<Expr | undefined> = new Set();

    {
        let temp: Set<Expr> = new Set();
        children_map.get(selected.id)?.forEach(c_id => {
            let n = exprs.find(c => c.id === c_id);
            if (n)
                temp.add(n);
        });
        while (temp.size != 0) {
            temp.forEach(e => affected.add(e));
            let t = temp;
            temp = new Set();
            t.forEach(e => children_map.get(e.id)?.forEach(c_id => {
                if (!c_id) {
                    throw "";
                }
                let n = exprs.find(c => c.id == c_id);
                if (n) {
                    temp.add(n);
                }
            }));
        }
    }

    let affected_list = Array.from(affected);

    return (
        <div className="modal">
            <div className="form">
                <div className="list">
                    <h3>Are your sure you want to remove expression:</h3>
                    <Expression expr={selected} selected={false} onSelect={() => { }} onBoundingChange={() => { }} onMove={() => { }}></Expression>
                    <p>The expressions below will be removed too:</p>
                    {
                        affected_list.map(e => {
                            if (e) {
                                return (<Expression expr={e} selected={false} onSelect={() => { }} onBoundingChange={() => { }} onMove={() => { }}></Expression>);
                            } else {
                                return <div></div>;
                            }
                        })
                    }
                </div>
                <button onClick={() => onSubmit(affected)}>OK</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}