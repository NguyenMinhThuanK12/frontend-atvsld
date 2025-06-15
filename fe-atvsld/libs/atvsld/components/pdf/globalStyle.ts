import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Lora",
    fontSize: 14,
    height: "auto",
    flexDirection: "column",
    display: "flex",
  },
  table: {
    width: "100%",
    marginTop: 20,
    height:  "auto",
    borderBottomWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  header: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  headerCell: {
    height: 50,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    borderLeftWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  column: {
    flexDirection: "column",
  },
  cell: {
    padding: 5,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 14,
    textAlign: "left",
  },
  centeredText: {
    fontSize: 14,
    textAlign: "center",
  },
  boldText: {
    fontWeight: 700,
  },
  italicText: {
    fontStyle: "italic",
  },
});

export default styles;
