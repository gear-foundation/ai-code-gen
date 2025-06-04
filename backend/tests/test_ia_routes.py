import pytest
from flask import Flask
from unittest.mock import patch
from ia_generator.routes.ia_routes import ia_generator_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(ia_generator_bp, url_prefix="/ia")
    return app

@pytest.fixture
def client(app):
    return app.test_client()


@patch("ia_generator.routes.ia_routes.smart_contract_handler")
def test_service_smartcontract_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/service_smartcontract_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_service_smartcontract_agent_missing_field(client):
    response = client.post("/ia/service_smartcontract_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.smart_contract_handler")
def test_lib_smartcontract_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/lib_smartcontract_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_lib_smartcontract_agent_missing_field(client):
    response = client.post("/ia/lib_smartcontract_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.smart_contract_handler")
def test_optimization_smartcontract_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/optimization_smartcontract_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_optimization_smartcontract_agent_missing_field(client):
    response = client.post("/ia/optimization_smartcontract_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.server_agent_handler")
def test_client_server_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/client_server_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_client_server_agent_missing_field(client):
    response = client.post("/ia/client_server_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.server_agent_handler")
def test_script_server_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/script_server_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_script_server_agent_missing_field(client):
    response = client.post("/ia/script_server_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.web3_abstraction_handler")
def test_gasless_ez_web3abstraction_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/gasless_ez_web3abstraction_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_gasless_ez_web3abstraction_agent_missing_field(client):
    response = client.post("/ia/gasless_ez_web3abstraction_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.web3_abstraction_handler")
def test_signless_ez_web3abstraction_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/signless_ez_web3abstraction_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_signless_ez_web3abstraction_agent_missing_field(client):
    response = client.post("/ia/signless_ez_web3abstraction_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.web3_abstraction_handler")
def test_gasless_server_script_web3abstraction_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/gasless_server_script_web3abstraction_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_gasless_server_script_web3abstraction_agent_missing_field(client):
    response = client.post("/ia/gasless_server_script_web3abstraction_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.frontend_agent_handler")
def test_sailsjs_frontend_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/sailsjs_frontend_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_sailsjs_frontend_agent_missing_field(client):
    response = client.post("/ia/sailsjs_frontend_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.frontend_agent_handler")
def test_gearjs_frontend_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/gearjs_frontend_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_gearjs_frontend_agent_missing_field(client):
    response = client.post("/ia/gearjs_frontend_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json


@patch("ia_generator.routes.ia_routes.frontend_agent_handler")
def test_gearhooks_frontend_agent_success(mock_handler, client):
    mock_handler.return_value = "Mocked response"
    response = client.post("/ia/gearhooks_frontend_agent", json={"question": "Prompt Test"})
    assert response.status_code == 200
    assert response.json["answer"] == "Mocked response"

def test_gearhooks_frontend_agent_missing_field(client):
    response = client.post("/ia/gearhooks_frontend_agent", json={})
    assert response.status_code == 400
    assert "error" in response.json