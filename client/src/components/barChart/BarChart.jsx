import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../theme";
import { mockBarData } from "../../data/mockData";

const defaultKeys = [
  "hot dog",
  "burger",
  "sandwich",
  "kebab",
  "fries",
  "donut",
];

const styles = {
  margin: { top: 45, right: 30, bottom: 50, left: 30 },
  innerPadding: 0,
  padding: 0.3,
  enableLabel: true,
  labelTextColor: {
    from: "color",
    modifiers: [["darker", 1.6]],
  },
};

export const BarChart = ({
  isDashboard = false,
  keys = defaultKeys,
  values = mockBarData,
  indexBy,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      {...styles}
      tooltip={({ id, value, color }) => (
        <strong
          style={{
            color: "black",
            backgroundColor: "white",
            padding: "4px 8px",
          }}
        >
          {id}: {value}
        </strong>
      )}
      data={values}
      tickValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      theme={{
        // added
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={keys}
      indexBy={indexBy}
      // gridYValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      // valueScale={{ type: "linear", clamp: true }}
    />
  );
};
