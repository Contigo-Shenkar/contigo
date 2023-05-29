import { Box } from "@mui/material";
import Header from "../../header/Header";
import { InsightCard } from "./insight-card/insight-card";

export const Insights = ({ insights }) => {
  console.log(insights);

  return (
    <div>
      <Header title="Child Behavioral Insights" />
      <Box display="flex" gap="20px">
        {insights.map((insight, index) => (
          <InsightCard key={index} title={insight} />
        ))}
      </Box>
    </div>
  );
};
