import os, tempfile, json
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import vision
from PIL import Image

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'serviceAccountKey.json'

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

with open('config.json', 'r') as f:
    config = json.load(f)

def optimize_image(image_path, max_size=(800, 800)):
    with Image.open(image_path) as img:
        img.thumbnail(max_size)
        jpeg_path = image_path + ".jpg"
        img.convert("RGB").save(jpeg_path, "JPEG", optimize=True, quality=85)
    return jpeg_path

def get_detected_objects(image_path):
    client = vision.ImageAnnotatorClient()

    try:
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)

        response = client.object_localization(image=image)
        objects = response.localized_object_annotations

        if response.error.message:
            raise Exception(f'Error: {response.error.message}')

        detected_objects = [obj.name for obj in objects]
        return detected_objects

    except Exception as e:
        return {'error': str(e)}

def get_recyclable_categories(detected_objects):
    matching_categories = set()
    for category, terms in config.items():
        if any(obj in terms for obj in detected_objects):
            matching_categories.add(category)
    return list(matching_categories) if matching_categories else None

def get_best_fitting_category(file_name, image_path, detected_objects, matched_categories):
    category_match_count = {category: 0 for category in matched_categories}
    for category in matched_categories:
        terms = config.get(category, [])
        category_match_count[category] = sum(1 for obj in detected_objects if obj in terms)

    best_category = max(category_match_count, key=category_match_count.get)
    highest_count = category_match_count[best_category]

    tied_categories = [cat for cat, count in category_match_count.items() if count == highest_count]

    if len(tied_categories) > 1:
        return granular_analysis_to_resolve_tie(file_name, image_path, tied_categories)

    return best_category

def granular_analysis_to_resolve_tie(image_path, tied_categories):
    client = vision.ImageAnnotatorClient()

    try:
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)

        response = client.label_detection(image=image)
        labels = [label.description for label in response.label_annotations]

        if response.error.message:
            raise Exception(f'Error: {response.error.message}')

        label_match_count = {category: 0 for category in tied_categories}
        for category in tied_categories:
            terms = config.get(category, [])
            label_match_count[category] = sum(1 for label in labels if label in terms)

        best_category = max(label_match_count, key=label_match_count.get)
        return best_category if label_match_count[best_category] > 0 else None

    except Exception as e:
        return {'error': str(e)}

def fetch_labels(image_path):
    client = vision.ImageAnnotatorClient()

    try:
        with open(image_path, "rb") as image_file:
            content = image_file.read()
        image = vision.Image(content=content)

        response = client.label_detection(image=image)
        labels = [label.description for label in response.label_annotations]

        if response.error.message:
            raise Exception(f'Error: {response.error.message}')

        return labels

    except Exception as e:
        return {'error': str(e)}

@app.route('/', methods=['GET', 'POST'])
def index():
    return 'Welcome to the SOTC_Backend Server!'

@app.route('/populate', methods=['POST'])
def get_labels():
    if 'files' not in request.files or len(request.files.getlist('files')) == 0:
        return jsonify({'error': 'No files uploaded'}), 400

    all_labels = []
    new_labels_list = []

    category = request.form.get('category')

    files = request.files.getlist('files')

    successfull_files = 0
    error_files = []
    total_new_labels = 0

    for file in files:
        if file.filename == '':
            continue

        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            file.save(temp_file.name)
            file_path = temp_file.name
            file_name = file.filename

        labels = fetch_labels(file_path)

        if isinstance(labels, dict) and "error" in labels:
            error_files.append(file_name)
            continue

        new_labels = []

        if category:
            if category not in config:
                config[category] = []

            for label in labels:
                if label not in config[category]:
                    new_labels.append(label)
                    if label not in config[category]:
                        config[category].append(label)
        else:
            for label in labels:
                found = any(label in values for values in config.values())
                if not found:
                    new_labels.append(label)

        all_labels.append(labels)
        successfull_files += 1
        total_new_labels += len(new_labels)

        if new_labels:
            new_labels_list.append((file_name, new_labels))

    if category and total_new_labels > 0:
        with open('config.json', 'w') as f:
            json.dump(config, f, indent=4)

    with open("labels.txt", "a") as f:
        for file_name, new_labels in new_labels_list:
            f.write(f"New labels for {file_name}: {{ {', '.join(f'\"{label}\"' for label in new_labels)} }}\n\n")


    if category:
        response_data = {
            "category": category,
            "labelsAdded": total_new_labels,
        }

    return jsonify(response_data), 200

@app.route('/analyse', methods=['POST'])
def upload_image():
    if 'file' not in request.files or request.files['file'].filename == '':
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        file.save(temp_file.name)
        file_path = temp_file.name
        file_name = file.filename

    optimized_image_path = optimize_image(file_path)

    analysis_result = get_detected_objects(optimized_image_path)

    if isinstance(analysis_result, dict) and 'error' in analysis_result:
        return jsonify({'error': analysis_result['error']}), 400

    detected_objects = analysis_result

    if not detected_objects:
        return jsonify({'result': 'No', 'category': "No match", "items": []}), 200

    recyclable_categories = get_recyclable_categories(detected_objects)

    if recyclable_categories:
        best_category = get_best_fitting_category(file_name, file_path, detected_objects, recyclable_categories)
        if best_category:
            return jsonify({'result': 'Yes', 'category': best_category, "items": detected_objects}), 200

    return jsonify({'result': 'No', 'category': "No match", "items": detected_objects}), 200

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)