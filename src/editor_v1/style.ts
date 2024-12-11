import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    container: {
      padding: 20,
      border: "1px solid #ccc",
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    panel: {
      border: "1px solid #ccc",
      padding: 10,
      overflowY: "auto",
      height: "300px"
    },
    itemHover: {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
    },
    resultBox: {
      display:'flex',
      justifyContent:"flex-start",
      alignItems:'center',
      alignContent:'center',
      marginTop: 16,
      padding: 10,
      border: "1px solid #000",
      backgroundColor: "#f9f9f9",
    },
  });