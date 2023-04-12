const medicationSchema = new mongoose.Schema({
  medicationType: { type: String, required: true }, // methylphenidate
  medicationName: { type: [String], required: true }, // [Ritalin, Concerta, Metadate, Methylin]
  diagnosis: { type: [String], required: true }, // [ADHD, ADD]
});

const medicationsModel = mongoose.model("medications", medicationSchema);

export default medicationsModel;
