import json

import pandas as pd

# Read the CSV file into a pandas DataFrame
df = pd.read_csv('drugsComTrain_raw.csv')
df = df.drop(['uniqueID', 'date', 'review'], axis=1)

# get all of the medical conditions from that list
condition_list = df['condition'].unique().tolist()

drugs_model = dict()

# go through all of the medical conditions
for j in condition_list:

    # for each medical condition go through all medications
    condition_subframe = df.loc[df['condition'] == j].copy()

    # get all drugs
    drugs = condition_subframe['drugName'].unique().tolist()

    condition_new_dict = dict()

    # iterate through all of the drugs
    for i in drugs:
        drug_new_dict = dict()
        drug_subframe = condition_subframe.loc[condition_subframe['drugName'] == i].copy()
        # calculate the score column, only multiplying when column1 is not 0
        drug_subframe['score'] = drug_subframe.apply(
            lambda row: row['usefulCount'] * row['rating'] if row['usefulCount'] != 0 else row['rating'], axis=1)
        # calculate the total score
        total_score = drug_subframe['score'].sum()

        drug_subframe['amount_of_reviews'] = drug_subframe.apply(
            lambda row: row['usefulCount'], axis=1)

        total_anount_of_reviews = drug_subframe['amount_of_reviews'].sum()
        drug_new_dict["score"] = float(total_score) / max(1, total_anount_of_reviews)
        drug_new_dict["amount of reviews"] = int(total_anount_of_reviews)
        condition_new_dict[i] = drug_new_dict

    drugs_model[j] = condition_new_dict

# print(drugs_model)
json_data = json.dumps(drugs_model, indent=3)


# # open a file for writing
with open('data.json', 'w') as f:
    # write the JSON string to the file
    f.write(json_data)
