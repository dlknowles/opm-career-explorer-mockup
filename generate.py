from faker import Faker
import json
import random

fake = Faker()
series = []
used_numbers = set()

numbers = list(range(65, 100))
weights = [1 / (i - 64) for i in numbers]

for i in range(1, 101):
    weighted_number = random.choices(numbers, weights, k=1)[0]
    while True:
        random_number = random.randint(1000, 1600)
        if random_number not in used_numbers:
            used_numbers.add(random_number)
            break

    jobs = []
    for j in range(1, 7):
        job = {
            "name": f"Job {j} for Series {i}",
            "description": fake.paragraph(nb_sentences=10),
            "id": f"{i}_{j}"
        }
        jobs.append(job)

    series_item = {
        "name": f"{fake.job()} Series",
        "number": f"{random_number}",
        "description": fake.paragraph(nb_sentences=15),
        "link": f"https://usajobs.gov/Series{i}",
        "jobs": jobs,
        "match": weighted_number
    }
    series.append(series_item)

data = {"series": series}

with open('dist/data/series.json', 'w') as f:
    json.dump(data, f, indent=4)
