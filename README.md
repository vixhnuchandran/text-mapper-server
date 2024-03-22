# Text Mapper Server

Text Mapper Server is a Node.js application responsible for server-side image processing in the Text Mapper ecosystem. Leveraging the power of Tesseract.js, this server handles the extraction of text from images, and returns processed images with highlighted bounding boxes.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/vixhnuchandran/text-mapper-server
    ```

2. Navigate to the project directory:

    ```bash
    cd text-mapper-server
    ```

3. Install dependencies:

    ```bash
    pnpm install
    ```

## Usage

To start the server, run:

```bash
pnpm start
```

The server will be accessible at http://localhost:port, where port is the port specified in your environment or default 3000.

## Development

To run the server in development mode with automatic restart on file changes, run:

```bash
pnpm run dev
```

License
This project is licensed under the ISC License.
