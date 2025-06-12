from flask import Flask, Blueprint, jsonify, request, abort
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

from ia_generator.routes.ia_routes import ia_generator_bp
from config import config


def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # === CORS ===
    CORS(app, resources={
        r"/ia-generator/*": {
            "origins": app.config["ALLOWED_ORIGINS"]
        }
    })

    # === Rate Limiter ===
    Limiter(
        get_remote_address,
        app=app,
        default_limits=[app.config["RATELIMIT_DEFAULT"]],
        storage_uri=app.config["RATELIMIT_STORAGE_URI"]
    )


    @app.before_request
    def restrict_access_by_token():
        #if request.path.startswith("/ia-generator"):
        #    token = request.headers.get("X-API-Key")
        #    if not token or token != app.config["API_KEY"]:
        #        abort(403, description="Forbidden: Invalid or missing API token")
        pass

    # === Routes ===
    app.register_blueprint(ia_generator_bp, url_prefix='/ia-generator')

    @app.route("/")
    def status_server():
        return f"✅ Running in {config_name} mode."

    return app


app = create_app(config_name=os.getenv("FLASK_ENV", "development"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=app.config["DEBUG"])
