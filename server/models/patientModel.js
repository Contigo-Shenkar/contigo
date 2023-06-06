import mongoose from "mongoose";
import { STATUSES } from "../helpers/tasks.js";
import { checkStage } from "../controllers/patient-controller.js";
import * as stages from "../../client/src/helpers/stages.mjs";
import { checkPatientStage } from "../controllers/helpers/check-stage.js";
const { daysPerStage } = stages;

const getDateDiffInDays = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / dayInMs);
};

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  tokenType: {
    type: String,
    enum: ["bonus", "regular"],
    default: "regular",
    required: true,
  },
  taskType: {
    // diagnosis
    type: String,
    required: true,
  },
  status: {
    type: String,
    // enum: Object.values(STATUSES),
    default: STATUSES.IN_PROGRESS,
  },
  createdAt: { type: Date, default: new Date() },
  completedAt: { type: Date },
  tokens: { type: Number },
  // Complete at a previous stage
  hidden: { type: Boolean, default: false },
});

const medicationSchema = new mongoose.Schema({
  medication: { type: String, required: true },
  condition: { type: String, required: true },
  // future
  dosage: { type: String },
  startedAt: { type: Date, default: new Date() },
  endedAt: { type: Date },
});

const reviewsSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    recognizedSymptoms: {
      type: [{ med: String, diagnosis: String, symptom: String }],
      default: [],
    },
  },
  { timestamps: true }
);

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String },
  contactNumber: { type: String, required: true },
  tokens: { type: Number, default: 0 },
  stage: { type: Number, default: 1 },
  stageStartDate: { type: Date, default: new Date() },
  tasks: { type: [taskSchema] },
  medication: { type: [medicationSchema] },
  reviews: { type: [reviewsSchema] },
  causeOfAdmitting: { type: String },
  diagnosis: { type: [String] },
  reasons: {
    type: [
      {
        diagnosis: String,
        reason: [String],
      },
    ],
    default: [],
  },
  insights: {
    type: [
      {
        bad: Boolean,
        text: String,
        when: Date,
      },
    ],
    default: [],
  },
  createdAt: { type: Date, default: new Date() },
  tasks: { type: [taskSchema] },
});
const patientModel = mongoose.model("patient", patientSchema);

export default patientModel;

// const files = fs.readdirSync("../client/public/assets/avatars");

(async function () {
  // return;
  const patients = await patientModel.find();
  // patients[0].stageStartDate = new Date("2021-06-01T00:00:00.000Z");
  for (let index = 0; index < patients.length; index++) {
    const patient = patients[index];
    // console.log("patient", patient);

    // patient.imageUrl = "/assets/avatars/" + files[index];

    // for (const med of patient.medication) {
    //   if (!med.medication) {
    //     med.remove();
    //   }
    // }

    // if (!patient.patientStartDate) {
    //   patient.stageStartDate = new Date();
    // }

    // await patient.save();
  }
  // for (const patient of patients) {
  // for (const task of patient.tasks) {
  // if (task.status === STATUSES.NOT_STARTED) {
  //   task.status = STATUSES.IN_PROGRESS;
  // }
  // if (task.status === `completed`) {
  //   task.status = STATUSES.NOT_STARTED;
  // }
  // if (task.status === `run`) {
  //   task.status = STATUSES.IN_PROGRESS;
  // }
  // if (!task.tokenType) {
  //   task.remove();
  //   continue;
  // }
  // if (!task.taskType || task.taskType === `type1`) {
  //   task.taskType = "ODD";
  // }
  // }
  // if (patient.diagnosis.length === 0) {
  //   patient.diagnosis.push("ADHD");
  // }
  // }
})();

const ONE_DAY = 1000 * 60 * 60 * 24;
// interval for checking the ability to level up
setInterval(async () => {
  const patients = await patientModel.find();
  for (const patient of patients) {
    // insights
    const { insights } = getInsights(patient);
    const insightsWithDate = insights.map((insight) => ({
      ...insight,
      when: new Date(),
    }));
    patient.insights = insightsWithDate;

    await patient.save();

    // check if enough days on stage
    const minimumDays = daysPerStage[patient.stage];
    const daysOnStage = Math.floor(
      (new Date() - new Date(patient.stageStartDate)) / (1000 * 60 * 60 * 24)
    );

    if (daysOnStage < minimumDays) {
      console.log("not enough days on stage", patient.fullName);
      continue;
    } else {
      console.log("enough days on stage", patient.fullName);
    }

    // check if all tasks are completed
    const { isSuccessful } = checkPatientStage(patient);
    console.log(patient.fullName, "isSuccessful", isSuccessful);

    if (isSuccessful) {
      console.log("level up", patient.fullName);
      const nextStage = patient.stage + 1;
      patient.stage = Math.min(nextStage, 5); // max stage is 5
      patient.stageStartDate = new Date();
      patient.tasks.forEach((task) => {
        // mark all tasks as hidden (previous stage tasks)
        task.hidden = true;
      });
    }

    await patient.save();
  }
}, ONE_DAY);

const getInsights = (patient) => {
  if (!patient?.tasks) return [];

  const last7days = getPast7Days();

  let completedAllTimeCount = 0;
  let completedTodayCount = 0;
  let completedRegularLast3Days = 0;
  let completedBonusLast3Days = 0;
  let completedBonusThisStage = 0;
  const availableStageTasks = { bonus: 0, regular: 0 };
  const openTasksInTheLast7Days = [];
  const completedTasksInTheLast7Days = [];
  const failedTasksTypes = new Set();

  const categoryCount = {};

  for (const t of patient?.tasks) {
    const category = categoryPerActivity.get(t.task);
    categoryCount[category] = categoryCount[category] || 0 + 1;

    if (t.status === STATUSES.IN_PROGRESS && isLastXDays(t.completedAt, 7)) {
      openTasksInTheLast7Days.push(t);
      failedTasksTypes.add(t.taskType);
    } else if (t.status === STATUSES.COMPLETED) {
      completedAllTimeCount++;

      if (!t.hidden) {
        completedTasksInTheLast7Days.push(t);
        if (isLastXDays(t.completedAt, 7)) {
          const key = getDayAndMonth(t.completedAt);
          last7days[key]++;

          if (isLastXDays(t.completedAt, 3)) {
            if (t.tokenType === "bonus") {
              completedBonusLast3Days++;
            } else {
              completedRegularLast3Days++;
            }

            if (isToday(new Date(t.completedAt))) {
              completedTodayCount++;
            }
          }
        }
      }
    }

    if (!t.hidden) {
      availableStageTasks[t.tokenType]++;

      if (t.tokenType === "bonus" && t.status === STATUSES.COMPLETED) {
        completedBonusThisStage++;
      }
    }
  }

  const pieChartData = [];
  for (const [category, count] of Object.entries(categoryCount)) {
    pieChartData.push({
      id: category,
      label: category,
      value: count,
      // color: colors[category],
    });
  }

  const insights = [];
  if (completedBonusLast3Days === 0) {
    insights.push({
      text: "No bonus tasks was completed in the last 3 days",
      bad: true,
    });
  }

  const daysAtStage = getDateDiffInDays(
    new Date(patient.stageStartDate).getTime(),
    Date.now()
  );

  const finishedBonusPercent =
    completedBonusThisStage / availableStageTasks.bonus;

  // 13 + 5 >= 20 // no - no alert
  // 15 +5 = 20 >= 20 // yes -  alert!

  // 10  - 8 = 80%
  // 2 - 1 = 50%
  // 12 - 9 = 75%

  if (
    finishedBonusPercent < 0.2 &&
    // check if patient is in the last quarter of the stage expected duration
    daysAtStage + daysPerStage[patient.stage] / 4 >= daysPerStage[patient.stage]
  ) {
    insights.push({
      text: `Only ${Math.round(
        (completedBonusThisStage / availableStageTasks.bonus) * 100
      )}% of bonus tasks was completed at current stage.`,
      bad: true,
    });
    insights.push({
      text: "Consider having a review with the patient",
      bad: true,
    });
  } else if (finishedBonusPercent > 0.2) {
    insights.push({
      text: `Patient is doing great at current stage: ${
        finishedBonusPercent * 100
      }% of bonus tasks was completed`,
      bad: false,
    });
  }

  if (completedRegularLast3Days === 0) {
    insights.push({
      text: `No regular tasks was completed in the last 3 days`,
      bad: true,
    });
  } else {
    insights.push({
      text: `Patient is doing great at current stage: ${completedRegularLast3Days} regular tasks was completed in the last 3 days`,
      bad: false,
    });
  }
  if (availableStageTasks.regular < 5) {
    insights.push({
      text: `Only ${availableStageTasks.regular} regular tasks assigned at current stage (need at least 5)`,
      bad: true,
    });
  }
  if (availableStageTasks.bonus < 2) {
    insights.push({
      text: `Only ${availableStageTasks.bonus} bonus tasks assigned at current stage (need at least 2)`,
      bad: true,
    });
  }

  if (daysAtStage > daysPerStage[patient.stage]) {
    insights.push({
      text: `Patient is already ${daysAtStage} days at current stage, which
        is more than the average of ${daysPerStage[patient.stage]} days`,
      bad: true,
    });
  }

  if (failedTasksTypes.size > 0) {
    insights.push({
      text: `Patient failed tasks typical to the following diagnoses: ${[
        ...failedTasksTypes,
      ].join(", ")}`,
      bad: true,
    });
  }

  let badInsightsCount = 0;
  for (const { bad } of insights) {
    badInsightsCount += bad ? 1 : 0;
  }

  if (badInsightsCount > 4) {
    insights.push({
      text: `We detected ${badInsightsCount} issues with this patient. Consider having a review with the patient`,
      bad: true,
    });
  }

  return {
    failedTasksTypes,
    openTasksInTheLast7Days,
    completedTasksInTheLast7Days,
    last7days,
    completedAllTimeCount,
    completedTodayCount,
    pieChartData,
    completedRegularLast3Days,
    completedBonusLast3Days,
    availableStageTasks,
    insights,
    daysAtStage,
  };
};

const dayInMs = 24 * 60 * 60 * 1000;
function isLastXDays(date, days) {
  return new Date(date).getTime() > new Date().getTime() - days * dayInMs;
}

function getPast7Days() {
  const today = new Date();
  const dateObj = {};
  [...Array(7)]
    .map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date;
    })
    .forEach((date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      dateObj[`${day}/${month}`] = 0;
    });
  return dateObj;
}

export const categoryPerActivity = new Map();

export const regularTasks = "Regular Tasks";

export const taskCategories = {
  [regularTasks]: [
    "Brushing teeth",
    "Washing face",
    "Showering",
    "Getting dressed",
    "Making the bed",
    "Preparing and having breakfast",
    "Preparing and packing lunch",
    "Reviewing schedule and tasks for the day",
    "Taking medication or supplements",
    "Active listening",
    "Effective communication",
    "Problem-solving",
    "Decision-making",
    "Empathy",
    "Open-mindedness",
    "Respectfulness",
    "Responsibility",
    "Self-awareness",
    "Self-control",
    "Self-esteem",
    "Perseverance",
  ],
  "Sensory Activities": [
    "Finger painting",
    "Sensory bin",
    "water play",
    "Bubble wrap popping",
    "Kinetic sand",
    "Scented playdough",
    "Sensory balls or fidget toys",
    "Tactile sensory boards",
    "Sensory bottles filled with glitter or other objects",
    "Sensory walks in nature",
    "Sensory storytelling",
    "Sensory art projects",
    "Sensory rooms or spaces",
    "Weighted blankets or vests",
    "Body socks or tunnels",
    "Trampolines or jumping exercises",
    "Swinging or rocking",
    "Playing with textured fabrics or materials",
    "Tactile puzzles or games",
    "Bubble baths or water play with toys",
    "Playing with slime or oobleck",
    "Sensory integration games like bean bag toss or ball catching",
  ],
  "Personal expression and reflection": [
    "Sensory-friendly cooking or baking",
    "Foam play or shaving cream art",
    "Sensory-friendly gardening or planting",
    "Listening to calming music or sounds",
    "Exploring with different scents and aromas",
    "Sensory-friendly science experiments",
    "Creative writing classes",
    "Role-playing exercises",
    "Improvisation exercises",
    "Personal storytelling",
    "Writing a memoir or personal essay",
    "Participating in a book club or discussion group",
    "Taking a personal development course or workshop",
    "Vision boarding",
    "Dream analysis",
    "Mind mapping",
    "Drawing a self-portrait",
    "Writing a letter to oneself",
    "Creating a personal mission statement",
    "Goal setting",
    "Reflective writing exercises",
    "Analyzing and interpreting personal symbols",
    "Practicing mindfulness",
    "Participating in a spiritual retreat",
    "Chanting or affirmations",
    "Practicing gratitude",
    "Volunteering",
    "Participating in a support group",
    "Building a personal altar",
    "Designing a personal flag or banner",
    "Making a gratitude jar or journal",
    "Creating art",
    "Making music",
    "Dance therapy",
  ],
  "Music Therapy": ["Singing", "Playing instrument", "Listening to music"],
  "Outdoor Activities": [
    "Playing in the park",
    "Going for a walk",
    "Riding a bike",
    "Hiking",
    "Horseback riding",
    "Gardening",
  ],
  "Social Skills Groups": [
    "Team building",
    "Board games that encourage cooperation",
    "Role-playing",
    "Cooperative games",
    "Team sports",
  ],
  "Art Therapy": [
    "Drawing",
    "Painting",
    "Sculpting",
    "Martial arts classes",
    "Drawing or coloring mandalas",
    "Painting with watercolors or acrylics",
    "Creating collages using magazine cutouts or other materials",
    "Making sculptures or 3D art with clay or other materials",
    "Journaling or writing poetry",
    "Creating a vision board with images",
    "Designing and decorating a dreamcatcher",
  ],
  "Physical Activities": [
    "Swimming",
    "Dancing",
    "Yoga",
    "Gardening",
    "Running or jogging",
    "Walking",
    "Skiing",
    "Soccer",
    "Rock climbing",
    "Rafting",
    "Pilates",
    "Tennis",
    "Team sports like football, rugby, or baseball",
    "Roller skating or rollerblading",
    "Basketball",
  ],
  Relaxation: [
    "Progressive muscle relaxation",
    "Body scan meditation",
    "Mindfulness meditation",
    "Deep breathing exercises",
    "Visualization",
    "Listening to soothing music",
    "Taking a warm bath or shower",
    "Spending time in nature",
    "Mindful walking",
    "Reading a book",
    "Watching a movie or TV show",
    "Journaling",
    "Coloring books for adults",
    "Knitting or crocheting",
    "Playing with a pet",
    "Stretching",
    "Taking a nap",
    "Spending time in a sauna or steam room",
    "Having a cup of herbal tea",
    "Doing a puzzle or Sudoku",
    "Getting a manicure or pedicure",
    "Acupuncture",
    "Reiki",
    "Reflexology",
    "Float therapy",
  ],
  "Therapy and communication": [
    "Talk therapy",
    "Cognitive Behavioral Therapy (CBT)",
    "Animal-assisted therapy",
  ],
  "Creative Expression": [
    "Learning and practicing money management skills",
    "Learning and practicing self-advocacy skills",
    "Practicing personal safety skills",
  ],
  "Independent Living Skills": [
    "Learning and practicing money management skills",
    "Learning and practicing self-advocacy skills",
    "Practicing personal safety skills",
  ],
  "Language Skills": [
    "Reading and storytelling",
    "Learning and practicing occupational skills through volunteer or work programs",
    "Word games (e.g. Scrabble, Boggle, Hangman)",
    "Learning new words each week",
    "Picture books",
    "Role-playing",
    "Volunteering for community activities that involve communication skills",
    "Attending speech therapy sessions",
    "Writing stories, letters, or emails",
    "Learning new languages",
    "Conversation practice",
  ],
  "Support groups activities": [
    "Support groups",
    "Group discussions",
    "Role-playing",
    "Creative expression",
    "Mindfulness exercises",
    "Guest speakers",
    "Goal setting",
    "Social activities",
    "Celebrations",
  ],
};

for (const category of Object.keys(taskCategories)) {
  for (const activity of taskCategories[category]) {
    categoryPerActivity.set(activity, category);
  }
}
function getDayAndMonth(date) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  return `${day}/${month}`;
}
function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
