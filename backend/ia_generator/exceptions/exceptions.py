class OpenAIServiceError(Exception):
    """
    Custom exception for handling OpenAI-related errors.
    """
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

    def __str__(self):
        return f"OpenAIServiceError: {self.message}"
