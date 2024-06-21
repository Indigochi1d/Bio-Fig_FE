import React, { useState, useEffect } from "react";
import "./SpreadSheet.css";
import { useNavigate } from "react-router-dom";

const SpreadSheet = () => {
  const [rows, setRows] = useState([["", "", ""]]);
  const [columns, setColumns] = useState(["x1", "x2", "x3"]);
  const [savedData, setSavedData] = useState([]);
  const [Xtitle, setXtitle] = useState("XTitle");
  const [Ytitle, setYtitle] = useState("YTitle");
  const navigate = useNavigate();

  useEffect(() => {
    const savedRows = JSON.parse(localStorage.getItem("rows"));
    const savedColumns = JSON.parse(localStorage.getItem("columns"));
    if (savedRows) setRows(savedRows);
    if (savedColumns) setColumns(savedColumns);
  }, []);

  // 로컬 스토리지에 상태를 저장하는 함수
  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [rows, columns]);

  const handleCellChange = (e, rowIndex, colIndex) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = e.target.value;
    setRows(newRows);
  };

  const handleColumnLabelChange = (e, colIndex) => {
    const newColumns = [...columns];
    newColumns[colIndex] = e.target.value;
    setColumns(newColumns);
  };

  const addRow = () => {
    setRows([...rows, Array(columns.length).fill("")]);
  };

  const addColumn = () => {
    setColumns([...columns, `X${columns.length + 1}`]);
    setRows(rows.map((row) => [...row, ""]));
  };

  const deleteRow = (rowIndex) => {
    setRows(rows.filter((_, index) => index !== rowIndex));
  };

  const deleteColumn = (colIndex) => {
    setColumns(columns.filter((_, index) => index !== colIndex));
    setRows(rows.map((row) => row.filter((_, index) => index !== colIndex)));
  };

  const saveData = () => {
    const transformedData = rows
      .map((row, rowIndex) => {
        return row.map((cell, colIndex) => ({
          x: colIndex,
          y: parseFloat(cell) || 0,
        }));
      })
      .flat()
      .sort((a, b) => a.x - b.x);
    setSavedData(transformedData);
    alert("Data saved!");
  };

  const onPlotGraph = () => {
    navigate("/scatter-bar-plot", {
      state: { savedData, columns, Xtitle, Ytitle },
    });
  };

  const onWriteXTitle = (e) => {
    setXtitle(e.target.value);
  };
  const onWriteYTitle = (e) => {
    setYtitle(e.target.value);
  };
  return (
    <div className="spreadSheet">
      <h1>Spreadsheet</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map((col, colIndex) => (
              <th key={colIndex}>
                <div className="header-cell">
                  <input
                    type="text"
                    value={col}
                    onChange={(e) => handleColumnLabelChange(e, colIndex)}
                  />
                  <button onClick={() => deleteColumn(colIndex)}>x</button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="td_row">
                <div className="row-header">
                  <button onClick={() => deleteRow(rowIndex)}>x</button>
                  {rowIndex + 1}
                </div>
              </td>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
      <button onClick={addColumn}>Add Column</button>
      <button onClick={saveData}>Save Data</button>
      <button onClick={onPlotGraph}>Plot Graph</button>
      <div className="titleInputContainer">
        <input
          type="text"
          placeholder="XTitle을 기입해주세요."
          className="titles"
          onChange={(e) => onWriteXTitle(e)}
        />
        <input
          type="text"
          placeholder="YTitle을 기입해주세요"
          className="titles"
          onChange={(e) => onWriteYTitle(e)}
        />
      </div>
      <h2>(개발용)Saved Data:</h2>
      <pre>{JSON.stringify(savedData, null, 2)}</pre>
    </div>
  );
};

export default SpreadSheet;
