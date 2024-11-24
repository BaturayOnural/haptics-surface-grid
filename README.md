# Synchronous Haptics Grid Mapping from Top-Down Images and Videos of Water Surface

This project contains source files and build instructions required. This project has been developed in the framework of ELG5121 course at UOttawa. The contributors are: `Erhan Baturay Onural` and `Jihong Zhang`. The project presentes a novel approach to analyze water waves from surface image and video type of inputs. It introduces a 5 x 7 grid system which shows wave intensities of each cell. The results are obtained by applying multiple analysis, more specifically by using edge detection, flow analysis and brightness analysis. The project also features a simple web application for the user to interact easily. The main contributions of this work include novel kind of haptics integration with visual media, a custom haptics grid representing the human hand and multi-modal interaction. This system can be used to develop interactive educational materials, novel rehabilitation techniques and in many different areas where haptics can play a role. The future work may focus on further integration of the results of this work to actual haptics hardware. This step would bind the virtual tactile experiences with real world, therefore improve the level of haptics experience significantly.

## Used Frameworks
The project utilizes several frameworks.
 - Python - main programming language
 - Vue.js - main frontend development
 - Flask - main backend development
 - OpenCV - image processing
 - Numpy - numerical representations

## Project Setup
The project includes both backend and frontend source files. The frontend source files are included in the file `frontend-source` folder. The backend source files are included starting from the root directory of the project. The frontend files are prebuilt and already can be found in the folder `dist`. If you would like to change the frontend files, please check the README file under the `frontend-source` folder. Example dataset can be found under the folder `dataset`. The main application's required steps to build are explained below.

Creating a python virtual environment is highly suggested. Build a virtual environment with a name `env`:
```
virtualenv env
```
Activate the virtual environment: (Linux/MacOS)
```
source env/bin/activate
```
Activate the virtual environment: (Windows)
```
env\Scripts\activate
```
Install dependencies:
```
pip install -r requirements.txt
```
Run the application:
```
python3 app.py
```

You should be able to see something similar as below:
```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5710
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 111-849-790
 ```

At this point, simply paste the URL `http://127.0.0.1:5710` to the browser address bar, and the landing page should be visible:


![Landing Page](https://i.ibb.co/0K1yJ6W/SS-Website.png)
