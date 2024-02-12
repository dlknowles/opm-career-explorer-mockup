import pandas as pd
import random
import json

# Function to generate a random weighted number
def generate_weighted_number():
    numbers = list(range(65, 100))
    weights = [1 / (i - 64) for i in numbers]
    return random.choices(numbers, weights, k=1)[0]

# Read the Excel file, specifying dtype for the 'Code' column
excel_data = pd.read_excel('dist/data/jet-series.xlsx', sheet_name='data', dtype={'Code': str})

# Drop columns with names starting with "Unnamed"
excel_data = excel_data.loc[:, ~excel_data.columns.str.startswith('Unnamed')]

# Create a list of Q columns and JobTitle columns
q_columns = [col for col in excel_data.columns if col.startswith('Q')]
jobtitle_columns = [col for col in excel_data.columns if col.startswith('JobTitle')]

# Convert Q columns and JobTitle columns to lists
excel_data['Q'] = excel_data[q_columns].values.tolist()
excel_data['JobTitles'] = excel_data[jobtitle_columns].apply(lambda row: row.dropna().tolist(), axis=1)

# Drop the original Q and JobTitle columns
excel_data.drop(columns=q_columns + jobtitle_columns, inplace=True)

# Add a new column for the random weighted numbers
excel_data['Match'] = excel_data.apply(lambda x: generate_weighted_number(), axis=1)

# Convert DataFrame to a list of dictionaries
json_list = excel_data.to_dict(orient='records')

# Wrap the list of dictionaries in another dictionary under the key "Series"
json_output = {'Series': json_list}

# Save JSON to a file
with open('dist/data/jet-series.json', 'w') as json_file:
    json.dump(json_output, json_file, indent=4)
