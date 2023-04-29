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

export const BarChart = ({
  isDashboard = false,
  keys = defaultKeys,
  values = mockBarData,
  indexBy,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log("keys", keys);
  console.log("values", values);

  return (
    <ResponsiveBar
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
      margin={{ top: 45, right: 30, bottom: 50, left: 30 }}
      padding={0.3}
      gridYValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      valueScale={{ type: "linear", clamp: true, min: 0 }}
      colors={{ scheme: "nivo" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      minScaleValueJump={1}
    />
  );
};
