import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import { evaluate } from "mathjs";
import ErrorIcon from '@mui/icons-material/Error';
import { useStyles } from "./style";

const defaultAttributes = [
  { name: "Attribute1", id: "attr1", values: [10, 20, 30] },
  { name: "Attribute2", id: "attr2", values: [5, 15, 25] },
  { name: "Attribute3", id: "attr3", values: [1, 2, 3] },
  { name: "Attribute4", id: "attr4", values: [100, 200, 300, 100, 200, 300, 100, 200, 300, 100, 200, 300] },
  { name: "Attribute5", id: "attr5", values: [7, 14, 21] },
];



const ExpressionEditor: React.FC = () => {
  const classes = useStyles();
  const [attributes, setAttributes] = useState(defaultAttributes);
  const [values, setValues] = useState<number[]>([]);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [error, setError] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAttributeClick = (id: string, values: number[]) => {
    setSelectedAttributeId(id);
    setValues(values);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHistory((prev) => [...prev, expression]);
    setRedoStack([]);
    setExpression(event.target.value);
  };

  const handleButtonClick = (value: string) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;

      const newExpression =
        expression.slice(0, start) + value + expression.slice(end);

      setHistory((prev) => [...prev, expression]);
      setRedoStack([]);
      setExpression(newExpression);

      setTimeout(() => {
        input.setSelectionRange(start + value.length, start + value.length);
      }, 0);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      setRedoStack((prev) => [expression, ...prev]);
      setExpression(history[history.length - 1]);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      setHistory((prev) => [...prev, expression]);
      setExpression(redoStack[0]);
      setRedoStack((prev) => prev.slice(1));
    }
  };

  const calculateExpression = () => {

    try {
      const evaluatedResult = evaluate(expression);
      setResult(evaluatedResult.toString());
      setError(false)
    } catch (error) {
      setError(true)
      setResult("Error in expression " + error);
    }
  };

  const clearResult = () => {
    setHistory((prev) => [...prev, expression]);
    setRedoStack([]);
    setExpression("");
    setResult("");
  };

  return (
    <Paper elevation={3} className={classes.container}>
      <Typography variant="h5" gutterBottom>
        Expression Editor
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        value={expression}
        inputRef={inputRef}
        onChange={handleInputChange}
        placeholder="Enter your expression here"
      />

      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateExpression}
          disabled={expression.length === 0}
        >
          Calculate
        </Button>
        <Button variant="contained" color="secondary" onClick={clearResult}>
          Clear
        </Button>
        <Button variant="contained" onClick={handleUndo} disabled={history.length === 0}>
          Undo
        </Button>
        <Button variant="contained" onClick={handleRedo} disabled={redoStack.length === 0}>
          Redo
        </Button>
      </Box>

      {result && (
        <Box className={classes.resultBox} sx={{ color: error ? "red" : '' }}>
          <Typography variant="h6">Result:</Typography>
          <Typography variant="body1">{result}</Typography>
          {error && <ErrorIcon />}
          
        </Box>
      )}

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        {/* Attributes Panel */}
        <Grid item xs={6}>
          <Paper className={classes.panel} elevation={1}>
            <Typography variant="h6" gutterBottom>
              Attributes
            </Typography>
            <List>
              {attributes.map((attr) => (
                <ListItem
                  key={attr.id}
                  className={`${classes.itemHover} ${selectedAttributeId === attr.id ? "selected" : ""
                    }`}
                  onClick={() => handleAttributeClick(attr.id, attr.values)}
                >
                  <ListItemText primary={attr.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Values Panel */}
        <Grid item xs={6} overflow={'auto'}>
          <Paper className={classes.panel} elevation={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" gutterBottom>
                Values
              </Typography>
              {values.length > 0 && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Min: {Math.min(...values)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Max: {Math.max(...values)}
                  </Typography>
                </Box>
              )}
            </Box>
            <List>
              {values.length > 0 ? (
                values.map((val, index) => (
                  <ListItem
                    key={index}
                    className={classes.itemHover}
                    onClick={() => handleButtonClick(val.toString())}
                  >
                    <ListItemText primary={val} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No values selected
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

      </Grid>
    </Paper>
  );
};

export default ExpressionEditor;
