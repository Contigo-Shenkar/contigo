import json
from textblob import TextBlob

def predict_and_update_model(prediction_info):
    # get a score based on nlp
    patient_score = get_review_score(prediction_info["review"])
    medication = prediction_info["medication"]
    condition = prediction_info["condition"]

    print("the score is:", patient_score)

    # calculate data with patient's review
    with open('data.json', 'r') as f:
        # load the JSON data into a dictionary
        data = json.load(f)

    # calculate the new score
    new_score = (data[condition][medication]['amount of reviews']*data[condition][medication]["score"] + patient_score) / (data[condition][medication][
        'amount of reviews'] + 1)
    new_amount_of_reviews = data[condition][medication]['amount of reviews'] + 1
    data[condition][medication]["score"] = new_score
    data[condition][medication]["amount of reviews"] = new_amount_of_reviews

    # update the model
    with open('data.json', 'w') as f:
        # write the dictionary to the file in JSON format
        json.dump(data, f)

    # get prediction
    condition_data = data[condition]
    sorted_medication_data = dict(sorted(condition_data.items(), key=lambda x: x[1]['score'], reverse=True))

    # if the score is lower than 5 omit it from the recommendations
    if patient_score <= 5:
        sorted_medication_data.pop(medication)

    # print(sorted_medication_data)
    return sorted_medication_data

def get_review_score(review):
    # create a TextBlob object from the review text
    blob = TextBlob(review)

    # get the sentiment polarity of the review (-1 to 1)
    sentiment = blob.sentiment.polarity

    # map the sentiment polarity to a score of 1 to 10
    score = int(round((sentiment + 1) * 4.5))

    # ensure the score is between 1 and 10
    score = max(1, min(score, 10))

    return score


# calculate data with patient's review
with open('prediction.json', 'r') as f:
    # load the JSON data into a dictionary
    user_input = json.load(f)

print("user_input", user_input)
print("user_input", user_input)
