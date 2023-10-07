# receipts_api_khz

## Instructions

1. Clone this repository to your machine
1. Go to this repo's root directory and build the docker image `docker build -t kevin_zhang/receipts:receipts_khz .`
1. Run `docker images -a` to check that the image now exists
1. After the image has been successfully built, run in the terminal `docker run -p 8000:8000 -d kevin_zhang/receipts:receipts_khz` to run the image
