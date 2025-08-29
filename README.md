# Sigils of The Codex

## Code Along: Recyclable Item Detector

By the end of this session, you will have a fully functional web application that can detect recyclable items in images using Google's Cloud Vision API. The application will allow users to upload images, process them through a Flask backend server, and display the results in a user-friendly web interface.

## Prerequisites
- You must have Node.js and npm installed on your machine. Head to https://nodejs.org/en/download/.

## Setup
1. Copy your `config.json` file from your Jupyter Notebook over to the `/server` directory.

2. Open `app.py` and setup CORS to allow requests from port `5173`.

3. Open `networking.js` and add a `baseURL`.

4. Navigate to the `server` directory and create a virtual environment.

    - Run `python -m venv venv` or `python3 -m venv venv` to create a virtual environment.
    - Activate the virtual environment:
      - On macOS/Linux: `source venv/bin/activate`
      - On Windows: `venv\Scripts\activate`
    - Install the required packages by running `pip install -r requirements.txt`.
    - Run the Flask server on port `8000` using `python app.py` or `python3 app.py`.

5. Navigate to the `client` directory and install npm packages with `npm install`.

6. Run the frontend server on port `5173` with `npm run dev`.