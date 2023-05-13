import { Box } from "@mui/material";
import Header from "../../header/Header";
import { InsightCard } from "./insight-card/insight-card";

const daysPerStage = {
  1: 14,
  2: 17,
  3: 19,
  4: 25,
  5: 32,
};

export const Insights = ({ insights }) => {
  console.log(insights);
  return (
    <div>
      <Header title="Insights" />
      <Box display="flex" gap="20px">
        {insights.completedBonusLast3Days === 0 ? (
          <InsightCard title="No bonus tasks was completed in the last 3 days" />
        ) : null}
        {insights.completedRegularLast3Days === 0 ? (
          <InsightCard title="No regular tasks was completed in the last 3 days" />
        ) : null}

        {insights.availableStageTasks.regular < 2 ? (
          <InsightCard
            title={`Only ${insights.availableStageTasks.regular} regular tasks assigned at current stage`}
          />
        ) : null}
        {insights.availableStageTasks.bonus < 2 ? (
          <InsightCard
            title={`Only ${insights.availableStageTasks.bonus} bonus tasks assigned at current stage`}
          />
        ) : null}
        {insights.daysPerStage > daysPerStage[insights.stage] ? (
          <InsightCard
            title={`Patient is already ${
              insights.daysPerStage
            } days at current stage, which is more than the average of ${
              daysPerStage[insights.stage]
            } days`}
          />
        ) : null}
      </Box>
    </div>
  );
};