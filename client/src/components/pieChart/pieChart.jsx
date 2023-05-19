import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { mockPieData } from "../../data/mockData";

const legends = [
  {
    anchor: "bottom",
    direction: "row",
    translateX: 0,
    translateY: 56,
    itemsSpacing: 0,
    itemWidth: 100,
    itemHeight: 18,
    itemTextColor: "#999",
    itemDirection: "left-to-right",

    symbolSize: 18,
    symbolShape: "circle",
  },
];

const styles = {
  margin: { top: 40, right: 80, bottom: 80, left: 80 },
  innerRadius: 0.5,
  padAngle: 0.7,
  cornerRadius: 3,
  activeOuterRadiusOffset: 8,
  arcLinkLabelsThickness: 2,
  arcLinkLabelsColor: { from: "color" },
};

const PieChart = ({ data = mockPieData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log(data);
  return (
    <ResponsivePie
      data={data}
      theme={getTheme(colors)}
      {...styles}
      arcLinkLabelsTextColor={colors.grey[100]}
      enableArcLabels={true}
      arcLabelsRadiusOffset={0.4}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      legends={legends}
    />
  );
};

export default PieChart;

function getTheme(colors) {
  return {
    axis: {
      domain: {
        line: {
          stroke: colors.grey[100],
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
  };
}
