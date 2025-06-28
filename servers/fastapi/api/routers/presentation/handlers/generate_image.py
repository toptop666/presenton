import os
import uuid
from api.models import LogMetadata
from api.routers.presentation.models import (
    GenerateImageRequest,
    PresentationAndPaths,
)
from api.services.logging import LoggingService
from api.services.instances import TEMP_FILE_SERVICE
from api.utils.utils import get_presentation_dir, get_presentation_images_dir
from image_processor.images_finder import generate_image


class GenerateImageHandler:

    def __init__(self, data: GenerateImageRequest):
        self.data = data

        self.session = str(uuid.uuid4())
        self.temp_dir = TEMP_FILE_SERVICE.create_temp_dir(self.session)

        self.presentation_dir = get_presentation_dir(self.data.presentation_id)

    async def post(self, logging_service: LoggingService, log_metadata: LogMetadata):

        logging_service.logger.info(
            logging_service.message(self.data.model_dump(mode="json")),
            extra=log_metadata.model_dump(),
        )

        images_directory = get_presentation_images_dir(self.data.presentation_id)
        image_path = await generate_image(self.data.prompt, images_directory)

        response = PresentationAndPaths(
            presentation_id=self.data.presentation_id, paths=[image_path]
        )

        logging_service.logger.info(
            logging_service.message(response.model_dump(mode="json")),
            extra=log_metadata.model_dump(),
        )

        return response
