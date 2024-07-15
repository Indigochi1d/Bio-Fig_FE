import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SpreadSheetContainer = styled.div`
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
`;

const Table = styled.table`
  margin: 0 auto;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  position: relative;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  position: relative;
`;

const HeaderCell = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const TitleInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const TitleInput = styled.input`
  width: 10rem;
  height: 3rem;
  margin-right: 15px;
  margin-top: 4rem;
  margin-bottom: 4rem;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const HeaderButton = styled.button`
  margin-left: 5px;
  padding: 2px 6px;
  border: none;
  background-color: #ff4d4d;
  color: white;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 4px;
`;

const RowHeaderButton = styled.button`
  margin-left: 5px;
  padding: 2px 6px;
  border: none;
  background-color: #ff4d4d;
  color: white;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 4px;
`;

const Pre = styled.pre`
  text-align: left;
  background: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  max-width: 600px;
  margin: 20px auto;
`;

const TdRow = styled.td`
  width: 40px;
  position: relative;
  border: 1px solid #ccc;
`;

const Diagonal = styled.th`
  background-image: linear-gradient(
    to left bottom,
    transparent calc(50% - 1px),
    #ccc,
    transparent calc(50% + 1px)
  );
  background-size: 120% 120%;
  background-position: center;
  border: 1px solid #ccc;
`;

const SpreadSheet = () => {
  const [rows, setRows] = useState([["", "", ""]]);
  const [columns, setColumns] = useState(["x1", "x2", "x3"]);
  const [savedData, setSavedData] = useState([]);
  const [Xtitle, setXtitle] = useState("");
  const [Ytitle, setYtitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedRows = JSON.parse(sessionStorage.getItem("rows"));
    const savedColumns = JSON.parse(sessionStorage.getItem("columns"));
    const savedXTitle = sessionStorage.getItem("Xtitle");
    const savedYTitle = sessionStorage.getItem("Ytitle");
    if (savedRows) setRows(savedRows);
    if (savedColumns) setColumns(savedColumns);
    if (savedXTitle) setXtitle(savedXTitle);
    if (savedYTitle) setYtitle(savedYTitle);

    const handleBeforeUnload = (event) => {
      sessionStorage.removeItem("rows");
      sessionStorage.removeItem("columns");
      sessionStorage.removeItem("Xtitle");
      sessionStorage.removeItem("Ytitle");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    sessionStorage.setItem("rows", JSON.stringify(rows));
    sessionStorage.setItem("columns", JSON.stringify(columns));
    sessionStorage.setItem("Xtitle", Xtitle);
    sessionStorage.setItem("Ytitle", Ytitle);
  }, [rows, columns, Xtitle, Ytitle]);

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
      .map((row) =>
        row.map((cell, colIndex) => ({
          x: colIndex,
          y: parseFloat(cell) || 0,
        }))
      )
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
    <SpreadSheetContainer>
      <h1>Spreadsheet</h1>
      <Table>
        <thead>
          <tr>
            <Diagonal></Diagonal>
            {columns.map((col, colIndex) => (
              <Th key={colIndex}>
                <HeaderCell>
                  <Input
                    type="text"
                    value={col}
                    onChange={(e) => handleColumnLabelChange(e, colIndex)}
                  />
                  <HeaderButton onClick={() => deleteColumn(colIndex)}>
                    x
                  </HeaderButton>
                </HeaderCell>
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <TdRow>
                <RowHeader>
                  {rowIndex + 1}
                  <RowHeaderButton onClick={() => deleteRow(rowIndex)}>
                    x
                  </RowHeaderButton>
                </RowHeader>
              </TdRow>
              {row.map((cell, colIndex) => (
                <Td key={colIndex}>
                  <Input
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                  />
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={addRow}>Add Row</Button>
      <Button onClick={addColumn}>Add Column</Button>
      <Button onClick={saveData}>Save Data</Button>
      <Button onClick={onPlotGraph}>Plot Graph</Button>
      <TitleInputContainer>
        <TitleInput
          type="text"
          placeholder="XTitle을 기입해주세요."
          value={Xtitle}
          onChange={onWriteXTitle}
        />
        <TitleInput
          type="text"
          placeholder="YTitle을 기입해주세요"
          value={Ytitle}
          onChange={onWriteYTitle}
        />
      </TitleInputContainer>
      <h2>(개발용)Saved Data:</h2>
      <Pre>{JSON.stringify(savedData, null, 2)}</Pre>
    </SpreadSheetContainer>
  );
};

export default SpreadSheet;
