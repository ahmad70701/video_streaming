# Video Streaming Platform

This project is a video streaming platform built with Express.js. Users can log in, upload videos in chunks, and stream videos in different resolutions.

## Features

- User authentication and login
- Video upload in chunks
- Video transcoding to multiple resolutions
- Stream videos in desired resolution

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ahmad70701/video_streaming.git
    ```
2. Navigate to the project directory:
    ```bash
    cd video_streaming/be
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage
The default port is 3000, You can change it in a .env file. Also add your mongoDB uri string in the .env file
`MONGO_URI= 'Your uri string'`

1. Start the server:
    ```bash
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Technologies Used

- Node.js
- Express.js
- MongoDB (for user and video data storage)
- FFmpeg (for video transcoding)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, please contact [ahmedaman7070@gmail.com](mailto:ahmedaman7070@gmail.com).
