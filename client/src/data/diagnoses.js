const adhdMedications = [
  "Ritalin",
  "Concerta",
  "Metadate",
  "Methylin",
  "Dexedrine",
  "Dextrostat",
  "Adderall",
  "Vyvanse",
  "Focalin",
  "Guanfacine (Intuniv)",
  "Clonidine (Kapvay)",
  "Atomoxetine (Strattera)",
  "Viloxazine (Vivalan)",
  "Bupropion (Wellbutrin)",
  "Modafinil (Provigil)",
  "Imipramine (Tofranil)",
  "Risperidone (Risperdal)",
  "Aripiprazole (Abilify)",
  "Quetiapine (Seroquel)",
  "Guanfacine (Tenex)",
  "Clonidine (Catapres)",
  "Fluoxetine (Prozac)",
  "Sertraline (Zoloft)",
  "Fluvoxamine (Luvox)",
  "Atomoxetine (Strattera)",
];

const asdMedications = [
  "Risperidone (Risperdal)",
  "Aripiprazole (Abilify)",
  "Quetiapine (Seroquel)",
  "Guanfacine (Intuniv)",
  "Clonidine (Kapvay)",
  "Fluoxetine (Prozac)",
  "Sertraline (Zoloft)",
  "Atomoxetine (Strattera)",
  "Melatonin",
];
const oddMedications = [
  "Methylphenidate (Ritalin)",
  "Concerta",
  "Dexmethylphenidate (Focalin)",
  "Dextroamphetamine (Dexedrine)",
  "Mixed amphetamine salts (Adderall)",
  "Guanfacine (Tenex, Intuniv)",
  "Clonidine (Catapres, Kapvay)",
  "Lithium",
  "Depakote",
  "Fluoxetine (Prozac)",
  "Sertraline (Zoloft)",
  "Risperidone (Risperdal)",
  "Aripiprazole (Abilify)",
  "Quetiapine (Seroquel)",
];

const sadMedications = [
  "Fluoxetine (Prozac)",
  "Sertraline (Zoloft)",
  "Paroxetine (Paxil)",
  "Venlafaxine (Effexor)",
  "Duloxetine (Cymbalta)",
  "Clomipramine (Anafranil)",
  "Propranolol (Inderal)",
  "Atenolol (Tenormin)",
  "Clonazepam (Klonopin)",
  "Lorazepam (Ativan)",
  "Pregabalin (Lyrica)",
  "Gabapentin (Neurontin)",
  "Buspirone (Buspar)",
];
const bnMedications = [
  "Fluoxetine",
  "Sertraline",
  "Paroxetine",
  "Clomipramine",
];
const gadMeds = [
  "Fluoxetine (Prozac)",
  "Sertraline (Zoloft)",
  "Paroxetine (Paxil)",
  "Duloxetine (Cymbalta)",
  "Venlafaxine (Effexor)",
  "Buspirone (Buspar)",
  "Clonazepam (Klonopin)",
  "Lorazepam (Ativan)",
  "Hydroxyzine (Vistaril)",
  "Pregabalin (Lyrica)",
  "Gabapentin (Neurontin)",
];
const sudMeds = [
  "Naltrexone",
  "Methadone",
  "Buprenorphine",
  "Clonidine",
  "Acamprosate",
  "Disulfiram",
  "Varenicline",
];
const schizoMeds = [
  "Risperidone",
  "Olanzapine",
  "Quetiapine",
  "Aripiprazole",
  "Ziprasidone",
  "Cariprazine",
  "Haloperidol",
  "Clozapine",
];
const conductDisorderMeds = [
  "Methylphenidate",
  "Amphetamines",
  "Atomoxetine",
  "Clonidine",
  "Guanfacine",
  "Aripiprazole",
  "Risperidone",
  "Quetiapine",
];
const ocdMeds = [
  "Fluoxetine",
  "Sertraline",
  "Paroxetine",
  "Fluvoxamine",
  "Clomipramine",
];
const ptsdMeds = [
  "Sertraline",
  "Fluoxetine",
  "Paroxetine",
  "Venlafaxine",
  "Mirtazapine",
  "Clonidine",
  "Prazosin",
];
const anorexiaMeds = [
  "Olanzapine",
  "Quetiapine",
  "Fluoxetine",
  "Sertraline",
  "Paroxetine",
  "Clomipramine",
];
const schizoAffectiveMeds = [
  "Olanzapine",
  "Quetiapine",
  "Fluoxetine",
  "Sertraline",
  "Paroxetine",
  "Clomipramine",
];
const bipolarMeds = [
  "Lithium",
  "Valproate",
  "Carbamazepine",
  "Lamotrigine",
  "Olanzapine",
];
const depressionMeds = [
  "Fluoxetine",
  "Sertraline",
  "Escitalopram",
  "Venlafaxine",
  "Duloxetine",
  "Bupropion",
  "Mirtazapine",
  "Trazodone",
  "Nortriptyline",
  "Amitriptyline",
  "Imipramine",
  "Phenelzine",
  "Tranylcypromine",
  "Selegiline",
];
export const DIAGNOSES = {
  "Conduct Disorder": {
    medications: conductDisorderMeds,
  },
  ODD: {
    medications: oddMedications,
  },
  ADHD: {
    medications: adhdMedications,
  },
  ASD: {
    medications: asdMedications,
  },
  GAD: {
    medications: gadMeds,
  },
  SAD: {
    medications: sadMedications,
  },
  Depression: {
    medications: depressionMeds,
  },
  "Bipolar Disorder": {
    medications: bipolarMeds,
  },
  OCD: {
    medications: ocdMeds,
  },
  PTSD: {
    medications: ptsdMeds,
  },
  "Anorexia Nervosa": {
    medications: anorexiaMeds,
  },
  "Bulimia Nervosa": {
    medications: bnMedications,
  },
  SUD: {
    medications: sudMeds,
  },
  Schizophrenia: {
    medications: schizoMeds,
  },
  "Schizoaffective Disorder": {
    medications: schizoAffectiveMeds,
  },
};
