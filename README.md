Instructions to Set Up the Environment on Windows
Step 1: Install Node.js
Download the latest LTS version of Node.js from Node.js official website.
Run the installer and ensure the option "Automatically install necessary tools" is checked during installation.
Verify the installation by opening the command prompt (CMD) and running:
bash
Copy code
node -v
npm -v
You should see the installed versions of Node.js and npm (Node Package Manager).

Step 2: Install MongoDB
Download MongoDB Community Edition from the MongoDB official website.
During installation:
Choose Complete Setup.
Enable the MongoDB Compass option for a GUI interface (optional).
Add MongoDB to the Windows PATH environment variable:
Open Environment Variables.
Under System Variables, find the Path variable and click Edit.
Add the path to MongoDB’s bin folder (e.g., C:\Program Files\MongoDB\Server\<version>\bin).
Verify the installation:
Open CMD and run:
bash
Copy code
mongod --version
mongo --version


Start the MongoDB server by running:
bash
Copy code
mongod --dbpath <path_to_data_directory>
Replace <path_to_data_directory> with a folder path where MongoDB will store data (e.g., C:\data\db).

Step 3: Clone the Repositories
Open CMD or a terminal and navigate to the folder where you want to clone the project.
Clone the repositories for the backend and frontend:
bash
Copy code
git clone https://github.com/aml-bendall/OneFeed-backend
git clone https://github.com/aml-bendall/OneFeed-frontend



Step 4: Set Up the Backend (Node.js)
Navigate to the backend project folder:
bash
Copy code
cd <backend-folder-name>


Install dependencies:
bash
Copy code
npm install


Create an .env file in the root of the backend folder with the following configuration:
env
Copy code
PORT=3000
MONGO_URI=mongodb://localhost:27017/onefeed
JWT_SECRET=<your_secret_key>


Start the backend server:
bash
Copy code
npm start


Verify the backend is running:
Open a browser and go to http://localhost:3000/api (or the defined route in your backend).

Step 5: Set Up the Frontend (Ionic)
Install Ionic CLI globally:
bash
Copy code
npm install -g @ionic/cli


Navigate to the frontend project folder:
bash
Copy code
cd <frontend-folder-name>


Install dependencies:
bash
Copy code
npm install


Start the Ionic development server:
bash
Copy code
ionic serve


Verify the frontend is running:
Open a browser and go to http://localhost:8100.

Step 6: Connect MongoDB to the Backend
Ensure MongoDB is running on localhost:27017.
The backend .env file already points to the local MongoDB instance:
env
Copy code
MONGO_URI=mongodb://localhost:27017/onefeed
If needed, adjust the database name (onefeed) or URI accordingly.
Test the connection by creating a user or adding mock data via the backend API.

Step 7: Additional Dependencies
Ensure the following are installed (if not already):
Git:
Download and install from Git official website.
Verify installation by running:
bash
Copy code
git --version


Visual Studio Code (VS Code) (optional but recommended for editing):
Download from VS Code official website.

Step 8: Running the Full Stack
Start the MongoDB server:
bash
Copy code
mongod --dbpath <path_to_data_directory>


Start the backend server:
bash
Copy code
cd <backend-folder-name>
npm start


Start the Ionic frontend:
bash
Copy code
cd <frontend-folder-name>
ionic serve


Open http://localhost:8100 in your browser to view the application.

Optional: Running the Backend and Frontend Simultaneously
Install a process manager like concurrently to start both servers with one command:
Install concurrently globally:
bash
Copy code
npm install -g concurrently


Create a script in the backend or frontend package.json:
json
Copy code
"scripts": {
  "dev": "concurrently \"npm run start:backend\" \"ionic serve\""
}


Start both servers:
bash
Copy code
npm run dev



