const causesHospitalizationODD = [
  {
    diagnosis: "ODD",
    causes: [
      "Crying fits",
      "Delusions",
      "Depressive disorder",
      "Disorganized thinking or speech",
      "Hallucinations",
      "Marked confusion or disorientation",
      "Outbursts of rage and anger",
      "Paranoia or intense suspiciousness",
      "School Refusal",
      "Self-destructive behaviors",
      "Severe agitation or aggression",
      "Severe impairment in daily functioning",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];

const causesHospitalizationASD = [
  {
    diagnosis: "ASD",
    causes: [
      "Feeding difficulties",
      "Epileptic seizures",
      "Outbursts of rage and anger",
      "Pica (ingesting non-food items)",
      "Psychotic symptoms or disorders",
      "Respiratory problems",
      "School Refusal",
      "Severe agitation or aggression",
      "Severe depression or mood disorders",
      "Severe self-injurious behaviors",
      "Suicidal ideation or attempts",
      "Suicidal thoughts",
      "Suicide attempt",
      "Uncontrolled epilepsy",
      "Violent or aggressive behaviors",
      "Wandering or elopement",
    ],
  },
];

const causesHospitalizationOCD = [
  {
    diagnosis: "OCD",
    causes: [
      "Anxiety or mood disorders",
      "Depressive disorder",
      "Outbursts of rage and anger",
      "Psychotic disorder",
      "Self-destructive behaviors",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];

const causesHospitalizationADHD = [
  {
    diagnosis: "ADHD",
    causes: [
      "Anxiety or mood disorders",
      "Attention deficit",
      "Depressive disorder",
      "Hyperactivity disorder",
      "Outbursts of rage and anger",
      "Psychotic disorder",
      "Severe self-injurious behaviors",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];

const causesHospitalizationAnorexia = [
  {
    diagnosis: "Anorexia",
    causes: [
      "Refusal to eat or drink",
      "Anxiety or mood disorders",
      "Dehydration or electrolyte imbalances",
      "Depressive disorder",
      "Failure to gain weight",
      "Outbursts of rage and anger",
      "Psychotic disorder",
      "School Refusal",
      "Severe self-injurious behaviors",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];

const causesHospitalizationIntellectualDisability = [
  {
    diagnosis: "Intellectual Disability",
    causes: [
      "Anxiety or mood disorders",
      "Comprehensive assessments",
      "Crying fits",
      "Deficit hyperactivity disorder",
      "Depressive disorder",
      "Psychotic disorder",
      "School Refusal",
      "Self-destructive behaviors",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];

const causesHospitalizationPTSD = [
  {
    diagnosis: "PTSD - Post-Traumatic Stress Disorder",
    causes: [
      "Depressive disorder",
      "Emotional dysregulation",
      "Emotional outbursts",
      "Flashbacks",
      "Impaired relationships and social isolation",
      "Inability to attend school",
      "Intrusive memories that significantly disrupt daily life",
      "Mood swings",
      "Nightmares",
      "School Refusal",
      "Self-destructive behaviors",
      "Sleep disturbances",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];
const causesHospitalizationSUD = [
  {
    diagnosis: "SUD - Substance Use Disorder",
    causes: [
      "Anxiety, or mood disorders",
      "Depressive disorder",
      "Outbursts of rage and anger",
      "Psychotic disorder",
      "Self-destructive behaviors",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];
const causesHospitalizationCD = [
  {
    diagnosis: "Conduct Disorder (CD)",
    causes: [
      "Anxiety, or mood disorders",
      "Depressive disorder",
      "Outbursts of rage and anger",
      "Psychotic disorder",
      "Self-destructive behaviors",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];
const causesHospitalizationDepression = [
  {
    diagnosis: "Depression",
    causes: [
      "Deficit hyperactivity disorder",
      "Depressive disorder",
      "Psychotic disorder",
      "Self-destructive behaviors",
      "Suicidal thoughts",
      "Suicide attempt",
      "Violent or aggressive behaviors",
    ],
  },
];

const causesHospitalizationAutisticDisorder = [
  {
    diagnosis: "Autistic disorder",
    causes: [
      "Depressive disorder",
      "Outbursts of rage and anger",
      "Psychotic disorder",
      "School Refusal",
      "Self-destructive behaviors",
      "Self-harming behaviors",
      "Significant deterioration in health or sudden",
      "Suicidal thoughts",
      "Suicide attempt",
    ],
  },
];

export const hospitalizationReasons = [
  ...causesHospitalizationADHD,
  ...causesHospitalizationASD,
  ...causesHospitalizationAnorexia,
  ...causesHospitalizationAutisticDisorder,
  ...causesHospitalizationCD,
  ...causesHospitalizationDepression,
  ...causesHospitalizationIntellectualDisability,
  ...causesHospitalizationOCD,
  ...causesHospitalizationODD,
  ...causesHospitalizationPTSD,
  ...causesHospitalizationSUD,
];
