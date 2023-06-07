// import DiagnosesAndMeds from "../helpers/diagnoses-and-meds.json" assert { type: "json" };

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const DiagnosesAndMeds = require('../helpers/diagnoses-and-meds.json');

export const getMedication = async (req, res) => {
  const { medicationName } = req.params;
  try {
    const medAndDiagnosis = DiagnosesAndMeds.find(
      (med) =>
        med["Medication/drug name"].toLowerCase() ===
        medicationName.toLowerCase()
    );

    if (!medAndDiagnosis) return res.json({ message: "Medication not found" });

    const alternativeMedications = DiagnosesAndMeds.filter(
      (med) =>
        medAndDiagnosis["Diagnosis/Condition"] === med["Diagnosis/Condition"]
    );
    alternativeMedications.forEach((med, i) => (med._id = i));

    res.status(200).json({ alternatives: alternativeMedications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
