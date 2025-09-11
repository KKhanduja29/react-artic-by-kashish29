import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchArtworks } from "../api/artic";
import type { Artwork } from "../types";
import { Button } from "primereact/button";

export default function ArtTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  // selection = array of Artwork objects
  const [selection, setSelection] = useState<Artwork[]>(() => {
    try {
      const raw = localStorage.getItem("selectedItems");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : []; // ✅ ensure it's always an array
    } catch {
      return [];
    }
  });

  const prevSelectionRef = useRef<Artwork[]>(selection);

  const loadPage = async (page = 1, limit = rows) => {
    setLoading(true);
    try {
      const { data, total } = await fetchArtworks(page, limit);
      setArtworks(data);
      setTotalRecords(total);
    } catch (err) {
      console.error("fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load page 1
    loadPage(1, rows);
  }, []);

  // persist selection to localStorage
  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selection));
  }, [selection]);

  const onPage = (event: any) => {
    const newFirst = event.first;
    const newRows = event.rows;
    const page = Math.floor(newFirst / newRows) + 1;
    setFirst(newFirst);
    setRows(newRows);
    loadPage(page, newRows);
  };

  const onSelectionChange = (e: any) => {
    const newSelection = e.value || [];
    setSelection(newSelection);
    prevSelectionRef.current = newSelection;
  };

  const deselectItem = (id: number) => {
    const newSel = selection.filter((item) => item.id !== id);
    setSelection(newSel);
    prevSelectionRef.current = newSel;
  };

  return (
    <div className="p-m-4">
      <h2>Art Institute Artworks</h2>
      <div className="p-grid">
        <div className="p-col-9">
          <DataTable
            value={artworks}
            lazy
            paginator
            rows={rows}
            totalRecords={totalRecords}
            first={first}
            onPage={onPage}
            loading={loading}
            dataKey="id"
            selection={selection}
            onSelectionChange={onSelectionChange}
            tableStyle={{ minWidth: "60rem" }}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="title" header="Title" sortable />
            <Column field="artist_display" header="Artist" />
            <Column field="place_of_origin" header="Place of Origin" />
            <Column field="inscriptions" header="Inscriptions" />
            <Column field="date_start" header="Date Start" />
            <Column field="date_end" header="Date End" />
          </DataTable>
        </div>

        <div className="p-col-3">
          <div className="card">
            <h3>Selected items ({selection.length})</h3>
            {selection.length === 0 && <p>No items selected yet.</p>}
            <ul>
              {Array.isArray(selection) &&
                selection.map((item) => (
                  <li key={item.id} style={{ marginBottom: 8 }}>
                    <strong>{item.title}</strong>
                    <div style={{ fontSize: 12 }}>{item.artist_display}</div>
                    <div style={{ marginTop: 4 }}>
                      <Button
                        label="Remove"
                        icon="pi pi-times"
                        className="p-button-text p-button-sm"
                        onClick={() => deselectItem(item.id)}
                      />
                    </div>
                  </li>
                ))}
            </ul>
            {selection.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <Button
                  label="Clear All"
                  className="p-button-danger p-button-sm"
                  onClick={() => {
                    setSelection([]);
                    prevSelectionRef.current = [];
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
